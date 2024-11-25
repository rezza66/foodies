import Category from "../models/categoryModel.js";

export const createCategory = async (req, res, next) => {
    try {
      let imagePath = '';
  
      if (req.file) {
        imagePath = req.file.path;
      }
  
      const category = new Category({
        name: req.body.name,
        image: imagePath
      });
  
      await category.save();
  
      res.status(201).json(category); 
    } catch (error) {
      next(error);
    }
  };

  export const getCategories = async (req, res, next) => {
    try {
      const categories = await Category.find();
      
      // Base URL untuk gambar
      const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
  
      // Memformat URL gambar untuk kategori jika diperlukan
      const categoriesWithImageUrl = categories.map((category) => {
        // Memastikan kategori memiliki field image dan memformat URL-nya
        const imagePath = category.image ? category.image.replace(/^uploads\/|\\/g, "/") : null;
        const formattedImageUrl = imagePath ? baseUrl + imagePath.replace(/^uploads\//, "") : null;
        return {
          ...category._doc, // Memastikan semua field kategori dikembalikan
          image: formattedImageUrl, // Menambahkan URL gambar yang telah diformat
        };
      });
  
      // Mengirimkan response dengan kategori yang telah diformat
      res.json(categoriesWithImageUrl);
    } catch (error) {
      next(error); // Menangani error dengan middleware error handling
    }
  };
  

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
    try {
      const { name } = req.body;
      let updateData = { name };
  
      if (req.file) {
        const newImagePath = req.file.path;
        updateData.image = newImagePath;
  
        if (req.body.old_image) {
          const oldImagePath = path.join(process.cwd(), "uploads", req.body.old_image);
          try {
            fs.unlinkSync(oldImagePath);
            console.log(`Deleted old image: ${oldImagePath}`);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
        }
      }
  
      const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
        new: true, 
        runValidators: true,
      });
  
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      res.json(category);
    } catch (error) {
      next(error); 
    }
  };

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (product.image) {
      const filePath = path.join(process.cwd(), product.image);
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted product image: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting product image: ${err}`);
      }
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
