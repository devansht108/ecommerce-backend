import multer from "multer";
import path from "path";

// Storage setup — yeh batata hai file kaha store hogi aur kya naam hoga
const storage = multer.diskStorage({
  // Destination folder — images is folder me save hongi
  destination(req, file, cb) {
    cb(null, "uploads/products/");
  },

  // Filename function — har image ko unique naam dene ke liye
  filename(req, file, cb) {
    // File ki extension nikal rahe hain (e.g. .jpg, .png)
    const ext = path.extname(file.originalname);

    // Unique filename banate hain — timestamp + random number
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    // Final filename multer ko de dete hain
    cb(null, fileName);
  },
});

// File filter — kaunsi types ki images allowed hain, yeh check karta hai
const fileFilter = (req, file, cb) => {
  // Allowed MIME types (sirf yeh formats upload ho sakte hain)
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  // Agar uploaded file allowed types me hai
  if (allowed.includes(file.mimetype)) {
    cb(null, true); // File accept kar lo
  } else {
    // Agar format galat hai toh error throw karo
    cb(new Error("Invalid image format"), false);
  }
};

// Multer middleware — storage + filter ko combine karke final uploader
const upload = multer({ storage, fileFilter });

// Export so that routes me use kiya ja sake
export default upload;
