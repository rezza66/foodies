import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLocationData, getAddress, createAddress } from '../../api/address';
import Swal from 'sweetalert2';

const UserAddress = () => {
  // State untuk menyimpan alamat yang ada
  const [addresses, setAddresses] = useState([]);

  // State untuk menyimpan data alamat baru yang akan ditambahkan
  const [newAddress, setNewAddress] = useState({
    nama: '',
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    kelurahan: '',
    detail: '',
  });

  // State untuk menyimpan data lokasi
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);

  // Mengambil token dari Redux store
  const token = useSelector((state) => state.auth.token);

  // useEffect untuk mem-fetch data alamat dan provinsi saat token tersedia
  useEffect(() => {
    if (token) {
      fetchAddresses();
      fetchProvinces();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'No token found. Please log in again.',
      });
    }
  }, [token]);

  // Fungsi untuk mengambil alamat pengguna
  const fetchAddresses = async () => {
    try {
      const response = await getAddress(token);
      if (Array.isArray(response)) {
        setAddresses(response);
      } else {
        setAddresses([]); // Pastikan addresses selalu array
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch addresses!',
      });
    }
  };

  // Fungsi untuk mengambil data provinsi
  const fetchProvinces = async () => {
    try {
      const response = await getLocationData('provinsi');
      setProvinces(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch provinces!',
      });
    }
  };

  // Handler saat provinsi berubah
  const handleProvinceChange = async (provinsiName) => {
    try {
      // Cari objek provinsi yang dipilih berdasarkan nama
      const selectedProvince = provinces.find((province) => province.name === provinsiName);
      if (selectedProvince) {
        // Update state dengan nama provinsi dan reset kabupaten, kecamatan, kelurahan
        setNewAddress({
          ...newAddress,
          provinsi: selectedProvince.name,
          kabupaten: '',
          kecamatan: '',
          kelurahan: '',
        });

        // Fetch kabupaten/kota berdasarkan ID provinsi
        const response = await getLocationData('kabupaten', selectedProvince.id);
        setRegencies(response.data);
        setDistricts([]);
        setKelurahans([]);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch regencies!',
      });
    }
  };

  // Handler saat kabupaten/kota berubah
  const handleRegencyChange = async (kabupatenName) => {
    try {
      // Cari objek kabupaten/kota yang dipilih berdasarkan nama
      const selectedRegency = regencies.find((regency) => regency.name === kabupatenName);
      if (selectedRegency) {
        // Update state dengan nama kabupaten/kota dan reset kecamatan, kelurahan
        setNewAddress({
          ...newAddress,
          kabupaten: selectedRegency.name,
          kecamatan: '',
          kelurahan: '',
        });

        // Fetch kecamatan berdasarkan ID kabupaten/kota
        const response = await getLocationData('kecamatan', selectedRegency.id);
        setDistricts(response.data);
        setKelurahans([]);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch districts!',
      });
    }
  };

  // Handler saat kecamatan berubah
  const handleKecamatanChange = async (kecamatanName) => {
    try {
      // Cari objek kecamatan yang dipilih berdasarkan nama
      const selectedDistrict = districts.find((district) => district.name === kecamatanName);
      if (selectedDistrict) {
        // Update state dengan nama kecamatan dan reset kelurahan
        setNewAddress({
          ...newAddress,
          kecamatan: selectedDistrict.name,
          kelurahan: '',
        });

        // Fetch kelurahan berdasarkan ID kecamatan
        const response = await getLocationData('kelurahan', selectedDistrict.id);
        setKelurahans(response.data);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch kelurahans!',
      });
    }
  };

  // Handler saat kelurahan berubah
  const handleKelurahanChange = (kelurahanName) => {
    // Cari objek kelurahan yang dipilih berdasarkan nama
    const selectedKelurahan = kelurahans.find((kelurahan) => kelurahan.name === kelurahanName);
    if (selectedKelurahan) {
      setNewAddress({
        ...newAddress,
        kelurahan: selectedKelurahan.name,
      });
    }
  };

  // Handler saat menambahkan alamat baru
  const handleAddAddress = async () => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'No token found. Please log in again.',
      });
      return;
    }

    // Validasi form
    const { nama, provinsi, kabupaten, kecamatan, kelurahan, detail } = newAddress;
    if (!nama || !provinsi || !kabupaten || !kecamatan || !kelurahan || !detail) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Data',
        text: 'Please fill in all fields.',
      });
      return;
    }

    try {
      await createAddress(newAddress, token);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Address added successfully!',
      });
      // Reset form alamat baru
      setNewAddress({
        nama: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        detail: '',
      });
      // Reset data lokasi
      setRegencies([]);
      setDistricts([]);
      setKelurahans([]);
      // Refresh daftar alamat
      fetchAddresses(); 
    } catch (error) {
      console.error('Error adding address:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add address!',
      });
    }
  };

  return (
    <div className='container'>
      <h3>User Address</h3>
      {addresses.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Nama Tempat</th>
              <th scope="col">Kelurahan</th>
              <th scope="col">Kecamatan</th>
              <th scope="col">Kabupaten</th>
              <th scope="col">Provinsi</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{address.nama}</td>
                <td>{address.kelurahan}</td>
                <td>{address.kecamatan}</td>
                <td>{address.kabupaten}</td>
                <td>{address.provinsi}</td>
                <td>{address.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No addresses found.</p>
      )}
      <h4>Add New Address</h4>
      <div className='card p-5 mx-auto' style={{ width: '30rem' }}>
        <div className="address-form">
          {/* Nama Tempat */}
          <div className="form-group">
            <label htmlFor="namaTempat">Nama Tempat:</label>
            <input
              type="text"
              id="namaTempat"
              className="form-control"
              value={newAddress.nama}
              onChange={(e) => setNewAddress({ ...newAddress, nama: e.target.value })}
            />
          </div>

          {/* Provinsi */}
          <div className="form-group">
            <label htmlFor="provinsi">Provinsi:</label>
            <select
              id="provinsi"
              className="form-control"
              value={newAddress.provinsi}
              onChange={(e) => handleProvinceChange(e.target.value)}
            >
              <option value="" disabled>Pilih Provinsi</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>{province.name}</option>
              ))}
            </select>
          </div>

          {/* Kabupaten/Kota */}
          <div className="form-group">
            <label htmlFor="kabupaten">Kabupaten/Kota:</label>
            <select
              id="kabupaten"
              className="form-control"
              value={newAddress.kabupaten}
              onChange={(e) => handleRegencyChange(e.target.value)}
              disabled={!regencies.length} // Disable jika regencies kosong
            >
              <option value="" disabled>Pilih Kabupaten/Kota</option>
              {regencies.map((regency) => (
                <option key={regency.id} value={regency.name}>{regency.name}</option>
              ))}
            </select>
          </div>

          {/* Kecamatan */}
          <div className="form-group">
            <label htmlFor="kecamatan">Kecamatan:</label>
            <select
              id="kecamatan"
              className="form-control"
              value={newAddress.kecamatan}
              onChange={(e) => handleKecamatanChange(e.target.value)}
              disabled={!districts.length} // Disable jika districts kosong
            >
              <option value="" disabled>Pilih Kecamatan</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>{district.name}</option>
              ))}
            </select>
          </div>

          {/* Kelurahan */}
          <div className="form-group">
            <label htmlFor="kelurahan">Kelurahan:</label>
            <select
              id="kelurahan"
              className="form-control"
              value={newAddress.kelurahan}
              onChange={(e) => handleKelurahanChange(e.target.value)}
              disabled={!kelurahans.length} // Disable jika kelurahans kosong
            >
              <option value="" disabled>Pilih Kelurahan</option>
              {kelurahans.map((kelurahan) => (
                <option key={kelurahan.id} value={kelurahan.name}>{kelurahan.name}</option>
              ))}
            </select>
          </div>

          {/* Detail Alamat */}
          <div className="form-group">
            <label htmlFor="detail">Detail:</label>
            <textarea
              id="detail"
              className="form-control"
              value={newAddress.detail}
              onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
            />
          </div>

          {/* Tombol Submit */}
          <button
            className="btn btn-primary mt-3"
            onClick={handleAddAddress}
          >
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAddress;
