/**
 * =========================================================================================
 * MÃ GOOGLE APPS SCRIPT CHO HỆ THỐNG TUYỂN DỤNG COFFEE 24/24
 * =========================================================================================
 * BƯỚC CÀI ĐẶT NHANH TRONG 2 PHÚT:
 * 1. Mở Google Sheet: https://docs.google.com/spreadsheets/d/1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE/edit?gid=0#gid=0
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết mã cũ trong cửa sổ đó và DÁN TOÀN BỘ ĐOẠN MÃ NÀY VÀO.
 * 4. Nhấn nút "Lưu" (biểu tượng đĩa mềm hoặc Ctrl + S).
 * 5. Nhấn nút "Triển khai" (Deploy) ở góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment):
 *    - Chọn loại: "Ứng dụng web" (Web app)
 *    - Mô tả: "Tuyển Dụng Coffee 24/24"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG ĐỂ KHÁCH VÀO WEB NỘP ĐƯỢC!
 * 6. Nhấn "Triển khai" (Deploy) -> Cấp quyền truy cập nếu Google yêu cầu.
 * 7. Sao chép "URL ứng dụng web" (Web App URL) và dán vào trang Quản trị (Admin) -> Tuyển Dụng -> Cấu Hình Google Script.
 * =========================================================================================
 */

const SPREADSHEET_ID = "1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE";
const DRIVE_FOLDER_ID = "1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-";

function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }

    // 1. Mở thư mục Google Drive để lưu Ảnh & CV
    let driveFolder;
    try {
      const folderId = data.driveFolderId || DRIVE_FOLDER_ID;
      driveFolder = DriveApp.getFolderById(folderId);
    } catch (folderErr) {
      driveFolder = DriveApp.getRootFolder();
    }

    // 2. Lưu Ảnh chân dung nếu có
    let photoDriveUrl = "";
    if (data.photoBase64 && data.photoBase64.length > 20) {
      try {
        const cleanBase64 = data.photoBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        const photoBlob = Utilities.newBlob(
          Utilities.base64Decode(cleanBase64),
          data.photoType || "image/jpeg",
          "ANH_" + (data.fullName ? data.fullName.replace(/\s+/g, "_") : "UngVien") + "_" + new Date().getTime() + "_" + (data.photoName || "photo.jpg")
        );
        const photoFile = driveFolder.createFile(photoBlob);
        photoFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoDriveUrl = photoFile.getUrl();
      } catch (photoErr) {
        photoDriveUrl = "Lỗi lưu ảnh: " + photoErr.message;
      }
    }

    // 3. Lưu File CV nếu có
    let cvDriveUrl = "";
    if (data.cvBase64 && data.cvBase64.length > 20) {
      try {
        const cleanCvBase64 = data.cvBase64.replace(/^data:[^;]+;base64,/, "");
        const cvBlob = Utilities.newBlob(
          Utilities.base64Decode(cleanCvBase64),
          data.cvType || "application/pdf",
          "CV_" + (data.fullName ? data.fullName.replace(/\s+/g, "_") : "UngVien") + "_" + new Date().getTime() + "_" + (data.cvName || "CV.pdf")
        );
        const cvFile = driveFolder.createFile(cvBlob);
        cvFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        cvDriveUrl = cvFile.getUrl();
      } catch (cvErr) {
        cvDriveUrl = "Lỗi lưu CV: " + cvErr.message;
      }
    }

    // 4. Mở Google Sheet và ghi dữ liệu ứng viên
    const spreadsheet = SpreadsheetApp.openById(data.spreadsheetId || SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0]; // Lấy trang tính đầu tiên

    // Tạo tiêu đề cột nếu trang tính còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Nộp",
        "Họ Và Tên Ứng Viên",
        "Số Điện Thoại",
        "Email",
        "Vị Trí Ứng Tuyển",
        "Chi Nhánh Mong Muốn",
        "Kinh Nghiệm / Lời Nhắn",
        "Link Ảnh Chân Dung (Drive)",
        "Link File CV (Drive)",
        "Trạng Thái Tuyển Dụng"
      ]);
      // Định dạng dòng tiêu đề
      const headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground("#2b170e");
      headerRange.setFontColor("#f59e0b");
      headerRange.setFontWeight("bold");
    }

    const appliedTime = data.appliedAt || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

    // Thêm dòng mới vào Google Sheet
    sheet.appendRow([
      appliedTime,
      data.fullName || "",
      "'" + (data.phone || ""), // Dấu ' để giữ nguyên số 0 ở đầu số điện thoại
      data.email || "",
      data.jobTitle || "",
      data.branchName || "Toàn hệ thống",
      data.note || "",
      photoDriveUrl,
      cvDriveUrl,
      "Mới Ứng Tuyển"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu ứng viên vào Google Sheet và Google Drive thành công!",
      photoUrl: photoDriveUrl,
      cvUrl: cvDriveUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Apps Script Tuyển Dụng Coffee 24/24 đang hoạt động tốt!",
    spreadsheetId: SPREADSHEET_ID,
    folderId: DRIVE_FOLDER_ID
  })).setMimeType(ContentService.MimeType.JSON);
}
