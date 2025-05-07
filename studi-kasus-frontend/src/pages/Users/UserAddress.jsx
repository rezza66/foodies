import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  createNewAddress,
  deleteUserAddress
} from "../../redux/slices/addressSlice";
import { getLocationData } from "../../api/address";
import Swal from "sweetalert2";

export const UserAddress = () => {
  const dispatch = useDispatch();
  const {
    addresses,
    status: addressStatus,
    error: addressError,
  } = useSelector((state) => state.addresses);
  const token = useSelector((state) => state.auth.token);
  const { data: user } = useSelector((state) => state.user);
  const [selected, setSelected] = useState({
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
  });

  const [locations, setLocations] = useState({
    provinsi: [],
    kabupaten: [],
    kecamatan: [],
    kelurahan: [],
  });

  const [newAddress, setNewAddress] = useState("");
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchAddresses(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provinces = await getLocationData("provinsi");
        setLocations((prev) => ({ ...prev, provinsi: provinces }));
      } catch (error) {
        console.error("Error loading provinces:", error);
      }
    };

    loadProvinces();
  }, []);

  const handleSelectChange = async (e, type) => {
    const { value } = e.target;
    setSelected((prev) => ({ ...prev, [type]: value }));

    try {
      if (type === "provinsi") {
        const regencies = await getLocationData("kabupaten", value);
        setLocations((prev) => ({ ...prev, kabupaten: regencies }));
      } else if (type === "kabupaten") {
        const districts = await getLocationData("kecamatan", value);
        setLocations((prev) => ({ ...prev, kecamatan: districts }));
      } else if (type === "kecamatan") {
        const villages = await getLocationData("kelurahan", value);
        setLocations((prev) => ({ ...prev, kelurahan: villages }));
      }
    } catch (error) {
      console.error(`Error loading ${type} data:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire("Error", "Anda harus login terlebih dahulu", "error");
      return;
    }

    try {
      const provinsiObj = locations.provinsi.find(
        (p) => p.id === selected.provinsi
      );
      const kabupatenObj = locations.kabupaten.find(
        (r) => r.id === selected.kabupaten
      );
      const kecamatanObj = locations.kecamatan.find(
        (d) => d.id === selected.kecamatan
      );
      const kelurahanObj = locations.kelurahan.find(
        (v) => v.id === selected.kelurahan
      );

      if (
        !nama?.trim() ||
        !newAddress?.trim() ||
        !provinsiObj ||
        !kabupatenObj ||
        !kecamatanObj ||
        !kelurahanObj
      ) {
        throw new Error("Semua field harus diisi");
      }

      const addressData = {
        nama: nama.trim(),
        provinsi: provinsiObj.name,
        kabupaten: kabupatenObj.name,
        kecamatan: kecamatanObj.name,
        kelurahan: kelurahanObj.name,
        detail: newAddress.trim(),
        user: user._id,
      };

      await dispatch(createNewAddress({ addressData, token })).unwrap();

      Swal.fire("Sukses", "Alamat berhasil disimpan", "success");

      setNama("");
      setNewAddress("");
      setSelected({
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        kelurahan: "",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Gagal", error.message || "Gagal menyimpan alamat", "error");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: 'Anda yakin ingin menghapus alamat ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!'
      });
  
      if (result.isConfirmed) {
        await dispatch(deleteUserAddress({ addressId, token })).unwrap();
        Swal.fire('Dihapus!', 'Alamat telah dihapus.', 'success');
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire('Gagal', error.message, 'error');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center text-primary">Tambah Alamat</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama Alamat</label>
              <input
                type="text"
                className="form-control"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Rumah, Kantor, Kos"
                maxLength={255}
                required
              />
              <small className="text-muted">Maksimal 255 karakter</small>
            </div>

            <div className="mb-3">
              <label className="form-label">Provinsi</label>
              <select
                className="form-select"
                value={selected.provinsi}
                onChange={(e) => handleSelectChange(e, "provinsi")}
                required
              >
                <option value="">Pilih Provinsi</option>
                {locations.provinsi.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Kabupaten/Kota</label>
              <select
                className="form-select"
                value={selected.kabupaten}
                onChange={(e) => handleSelectChange(e, "kabupaten")}
                disabled={!selected.provinsi}
                required
              >
                <option value="">Pilih Kabupaten/Kota</option>
                {locations.kabupaten.map((kab) => (
                  <option key={kab.id} value={kab.id}>
                    {kab.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Kecamatan</label>
              <select
                className="form-select"
                value={selected.kecamatan}
                onChange={(e) => handleSelectChange(e, "kecamatan")}
                disabled={!selected.kabupaten}
                required
              >
                <option value="">Pilih Kecamatan</option>
                {locations.kecamatan.map((kec) => (
                  <option key={kec.id} value={kec.id}>
                    {kec.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Kelurahan</label>
              <select
                className="form-select"
                value={selected.kelurahan}
                onChange={(e) => handleSelectChange(e, "kelurahan")}
                disabled={!selected.kecamatan}
                required
              >
                <option value="">Pilih Kelurahan</option>
                {locations.kelurahan.map((kel) => (
                  <option key={kel.id} value={kel.id}>
                    {kel.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Detail Alamat</label>
              <textarea
                className="form-control"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Masukkan detail alamat (contoh: Jalan, Nomor Rumah, Patokan)"
                rows={3}
                maxLength={1000}
                required
              />
              <small className="text-muted">Maksimal 1000 karakter</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 shadow-sm"
              disabled={addressStatus === "loading"}
            >
              {addressStatus === "loading" ? "Menyimpan..." : "Simpan Alamat"}
            </button>
          </form>

          <h3 className="mt-4 text-primary">Alamat Tersimpan</h3>
          <ul className="list-group mt-2">
            {addressStatus === "loading" ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : addressError ? (
              <p className="text-danger text-center">{addressError}</p>
            ) : addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <li key={index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{addr.nama}</strong>
                      <p className="mb-1">
                        {addr.detail}, {addr.kelurahan}, {addr.kecamatan},{" "}
                        {addr.kabupaten}, {addr.provinsi}
                      </p>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteAddress(addr._id)}
                        disabled={addressStatus === "loading"}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-muted text-center">
                Belum ada alamat tersimpan.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
