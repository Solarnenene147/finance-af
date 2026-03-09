import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import {
  FaXmark,
  FaUserPen,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaRightFromBracket,
  FaTriangleExclamation,
  FaCakeCandles,
  FaMarsDouble,
  FaCircleCheck,
  FaUserShield,
  FaKey,
  FaSpinner,
  FaCamera,
  FaSkull,
  FaCircleExclamation,
} from "react-icons/fa6";

const SettingsOverlay = ({ isOpen, onClose }) => {
  const { logout, profile, updateAvatar, user } = useAuth();
  const navigate = useNavigate();

  // STATE DỮ LIỆU
  const [userData, setUserData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    gender: "male",
    avatar_url: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [initialData, setInitialData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  // STATE THÔNG BÁO & XÁC THỰC
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [confirmPassword, setConfirmPassword] = useState("");

  // STATE TRẠNG THÁI UI
  const [hasChanges, setHasChanges] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile && isOpen) {
      const data = {
        fullName: profile.full_name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        dob: profile.dob || "",
        gender: profile.gender || "male",
        avatar_url: profile.avatar_url || "",
      };
      setUserData(data);
      setInitialData(data);
    }
  }, [profile, isOpen]);

  useEffect(() => {
    const changed = JSON.stringify(userData) !== JSON.stringify(initialData);
    setHasChanges(changed && activeTab === "profile");
  }, [userData, initialData, activeTab]);

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
  };

  if (!isOpen) return null;

  const verifyIdentity = async (pwd) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: pwd,
    });
    if (error) throw new Error("Mật mã xác thực danh tính không chính xác.");
    return true;
  };

  const handleSyncProfile = async () => {
    setIsVerifying(true);
    try {
      await verifyIdentity(confirmPassword);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userData.fullName,
          phone: userData.phone,
          dob: userData.dob,
          gender: userData.gender,
        })
        .eq("id", user.id);

      if (error) throw error;

      showStatus("success", "Cập nhật thông tin hồ sơ thành công.");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      showStatus("error", error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      showStatus("error", "Yêu cầu mật mã hiện tại.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showStatus("error", "Xác nhận mật mã không khớp.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showStatus("error", "Mật mã mới tối thiểu 06 ký tự.");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyIdentity(passwordData.currentPassword);
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });
      if (error) throw error;
      showStatus("success", "Thay đổi mật mã truy cập thành công.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
    } catch (error) {
      showStatus("error", error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUploadAvatar = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // Kiểm tra định dạng ảnh cho chuyên nghiệp
      if (!file.type.startsWith("image/")) {
        showStatus("error", "Vui lòng chọn định dạng hình ảnh hợp lệ.");
        return;
      }

      // Cấu trúc: id_nguoi_dung/random_name.ext (Folder theo ID để Policy RLS bắt được)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Đẩy ảnh lên Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Ghi đè nếu trùng
        });

      if (uploadError) throw uploadError;

      // 2. Lấy URL công khai
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // 3. Cập nhật vào DB Profiles để đồng bộ Sidebar
      await updateAvatar(user.id, publicUrl);

      setUserData((prev) => ({ ...prev, avatar_url: publicUrl }));
      showStatus("success", "Ảnh đại diện đã được cập nhật thành công.");
    } catch (error) {
      console.error("Lỗi Upload:", error);
      showStatus("error", `Lỗi tải ảnh: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showStatus("error", "Vui lòng cung cấp mật mã xác thực lệnh xóa.");
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Xác thực mật mã chính chủ lần cuối (Gigachad Check)
      await verifyIdentity(deletePassword);

      // 2. Gọi hàm RPC để xóa tận gốc cả tài khoản Auth lẫn Profile
      const { error: rpcError } = await supabase.rpc("delete_user_forever");

      if (rpcError) throw rpcError;

      // 3. Thông báo thành công và dọn dẹp Client
      showStatus("success", "Tài khoản đã xóa. Đang đăng xuất...");

      setTimeout(async () => {
        await logout();
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Lỗi xóa sổ:", error.message);
      showStatus("error", `Thất bại: ${error.message}`);
      setIsVerifying(false);
    }
  };
  const handleFinalLogout = async () => {
    await logout();
    onClose();
    navigate("/");
  };

  const displayInitials = userData.fullName
    ? userData.fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AF";

  return (
    <AnimatePresence mode="wait">
      <div
        style={{ fontFamily: "sans-serif" }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-bold"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 0.85, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl h-[680px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex border border-slate-200 dark:border-white/10 font-bold"
        >
          {/* SIDEBAR */}
          <div className="flex flex-col p-8 font-bold transition-colors border-r w-72 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center mb-10 text-center group">
              <div className="relative flex items-center justify-center w-24 h-24 mb-4 overflow-hidden border-4 border-white shadow-xl rounded-3xl bg-primary dark:border-slate-700">
                {userData.avatar_url ? (
                  <img
                    src={userData.avatar_url}
                    className="object-cover w-full h-full"
                    alt="Profile"
                  />
                ) : (
                  <span className="text-2xl italic font-bold text-white">
                    {displayInitials}
                  </span>
                )}
                <label className="absolute inset-0 flex flex-col items-center justify-center transition-all opacity-0 cursor-pointer bg-black/60 group-hover:opacity-100">
                  {uploading ? (
                    <FaSpinner className="text-white animate-spin" />
                  ) : (
                    <FaCamera className="text-xl text-white" />
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    disabled={uploading}
                  />
                </label>
              </div>
              <h3 className="w-full text-[15px] font-bold tracking-tight uppercase truncate dark:text-white">
                {profile?.role === "admin" ? "Quản trị viên" : "Thành viên"}
              </h3>
            </div>

            <nav className="flex-1 space-y-2">
              {[
                {
                  id: "profile",
                  label: "Thông tin tài khoản",
                  icon: <FaUserPen />,
                },
                { id: "security", label: "Bảo mật", icon: <FaLock /> },
                { id: "danger", label: "Vùng nguy hiểm", icon: <FaSkull /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setStatusMsg({ type: "", text: "" });
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[12px] transition-all uppercase tracking-tight ${activeTab === item.id ? (item.id === "danger" ? "bg-expense text-white shadow-lg shadow-expense/20" : "bg-primary text-white shadow-lg shadow-primary/20") : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
                >
                  <span className="text-lg">{item.icon}</span> {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center gap-4 px-5 py-4 mt-auto text-[12px] font-bold uppercase border-2 border-red-500/30 text-expense hover:bg-expense hover:text-white rounded-2xl transition-all"
            >
              <FaRightFromBracket /> Đăng xuất
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="relative flex flex-col flex-1 p-12 font-bold transition-all bg-white dark:bg-slate-900">
            <button
              onClick={onClose}
              className="absolute z-10 text-2xl transition-all top-10 right-10 text-slate-300 hover:text-primary"
            >
              <FaXmark />
            </button>

            {/* STATUS BANNER */}
            <AnimatePresence>
              {statusMsg.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-2 p-3 mb-6 rounded-xl text-[10px] font-bold uppercase tracking-wider ${statusMsg.type === "success" ? "bg-income/10 text-income border border-income/20" : "bg-expense/10 text-expense border border-expense/20"}`}
                >
                  {statusMsg.type === "success" ? (
                    <FaCircleCheck />
                  ) : (
                    <FaCircleExclamation />
                  )}{" "}
                  {statusMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 pr-2 overflow-y-auto font-bold custom-scrollbar">
              {activeTab === "profile" && (
                <div className="space-y-8 font-bold animate-in fade-in slide-in-from-right-4">
                  <h2 className="pb-4 text-[20px] font-bold tracking-tighter uppercase border-b text-slate-800 dark:text-white border-slate-100 dark:border-slate-800">
                    Thông tin cá nhân
                  </h2>
                  <div className="grid gap-6 font-bold">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                        Họ và tên
                      </label>
                      <input
                        placeholder="Họ và tên đầy đủ..."
                        value={userData.fullName}
                        onChange={(e) =>
                          setUserData({ ...userData, fullName: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                        Email
                      </label>
                      <input
                        value={userData.email}
                        disabled
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none dark:text-white transition-all cursor-not-allowed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6 font-bold">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                          Số điện thoại
                        </label>
                        <input
                          placeholder="0901 xxx xxx"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                          Ngày tháng năm sinh
                        </label>
                        <input
                          type="date"
                          value={userData.dob}
                          onChange={(e) =>
                            setUserData({ ...userData, dob: e.target.value })
                          }
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                        Giới tính
                      </label>
                      <div className="flex gap-2 p-1 border-2 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-[58px]">
                        {["male", "female"].map((g) => (
                          <button
                            key={g}
                            onClick={() =>
                              setUserData({ ...userData, gender: g })
                            }
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-[12px] font-bold uppercase transition-all ${userData.gender === g ? "bg-primary text-white shadow-md" : "text-slate-500 dark:text-slate-400"}`}
                          >
                            {g === "male" ? (
                              <FaMarsDouble />
                            ) : (
                              <FaMarsDouble className="rotate-180" />
                            )}{" "}
                            {g === "male" ? "Nam" : "Nữ"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 font-bold animate-in fade-in slide-in-from-right-4">
                  <h2 className="pb-4 text-[20px] font-bold tracking-tighter uppercase border-b text-slate-800 dark:text-white border-slate-100 dark:border-slate-800">
                    Bảo mật
                  </h2>
                  <div className="space-y-6 font-bold">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                      />
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isVerifying}
                      className="w-full py-4 bg-primary text-white font-bold text-[12px] uppercase rounded-2xl shadow-xl mt-4 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <FaSpinner className="mx-auto animate-spin" />
                      ) : (
                        "Cập nhật mật khẩu"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "danger" && (
                <div className="space-y-8 font-bold animate-in fade-in slide-in-from-right-4">
                  <h2 className="pb-4 text-[20px] tracking-tighter uppercase border-b text-expense border-slate-100 dark:border-slate-800 font-bold">
                    Vùng nguy hiểm
                  </h2>
                  <div className="p-8 border-2 border-expense/20 bg-expense/5 rounded-[2.5rem] space-y-6 font-bold text-center">
                    <FaTriangleExclamation
                      size={40}
                      className="mx-auto text-expense"
                    />
                    <h4 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase italic">
                      Chấm dứt tài khoản vĩnh viễn
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                      Toàn bộ dữ liệu định danh và tài sản sẽ bị xóa bỏ vĩnh
                      viễn. Không thể hoàn tác.
                    </p>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="w-full py-4 bg-expense text-white font-bold text-[12px] uppercase rounded-2xl shadow-lg active:scale-95 transition-all"
                    >
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="flex items-center justify-between p-4 mt-6 font-bold text-white border shadow-2xl bg-slate-800 dark:bg-primary rounded-3xl border-white/10"
                >
                  <div className="flex items-center gap-3 ml-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Phát hiện dữ liệu định danh mới
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-6 py-2.5 text-[10px] font-bold uppercase bg-white text-slate-900 rounded-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    Đồng bộ dữ liệu
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* PASSWORD MODAL (XÁC THỰC LƯU) */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 font-bold">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center border dark:border-white/10 font-bold"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-2xl rounded-full bg-primary/10 text-primary">
                  <FaKey />
                </div>
                <h3 className="text-[18px] font-bold uppercase dark:text-white mb-2 italic">
                  Phê duyệt lệnh
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">
                  Nhập mật khẩu để xác thực thay đổi
                </p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                />
                <div className="flex flex-col gap-2 font-bold">
                  <button
                    onClick={handleSyncProfile}
                    disabled={isVerifying}
                    className="w-full py-4 bg-primary text-white font-bold text-[12px] uppercase rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <FaSpinner className="mx-auto animate-spin" />
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setConfirmPassword("");
                    }}
                    className="w-full py-2 text-[12px] font-bold uppercase text-slate-400"
                  >
                    Hủy
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DELETE CONFIRM MODAL */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 font-bold">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-4 border-expense/10 font-bold"
              >
                <div className="w-20 h-20 bg-expense/10 text-expense rounded-full flex items-center justify-center text-[40px] mb-6 mx-auto animate-bounce">
                  <FaSkull />
                </div>
                <h3 className="text-[22px] font-bold uppercase dark:text-white mb-2 italic">
                  Xóa tài khoản
                </h3>
                <p className="px-4 mb-8 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                  Vui lòng nhập mật khẩu để xác nhận xóa tài khoản.
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[12px] font-bold outline-none focus:border-primary dark:text-white transition-all"
                />
                <div className="flex flex-col gap-3 font-bold">
                  <button
                    disabled={!deletePassword || isVerifying}
                    onClick={handleDeleteAccount}
                    className={`w-full py-4 font-bold text-[12px] uppercase rounded-2xl transition-all ${deletePassword ? "bg-expense text-white shadow-xl hover:brightness-110 active:scale-95" : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"}`}
                  >
                    {isVerifying ? (
                      <FaSpinner className="mx-auto animate-spin" />
                    ) : (
                      "Xóa tài khoản"
                    )}
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full py-2 text-[12px] font-bold uppercase text-slate-500"
                  >
                    Hủy
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* LOGOUT CONFIRM */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 font-bold">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center border dark:border-white/10 font-bold"
              >
                <FaTriangleExclamation className="mx-auto text-[40px] text-expense mb-6 animate-pulse" />
                <h3 className="text-[20px] font-bold uppercase dark:text-white mb-2 italic">
                  Kết thúc phiên làm việc?
                </h3>
                <div className="flex flex-col gap-2 font-bold">
                  <button
                    onClick={handleFinalLogout}
                    className="w-full py-4 text-[12px] font-bold text-white uppercase shadow-lg bg-expense rounded-2xl transition-all active:scale-95"
                  >
                    Xác nhận đăng xuất
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-full py-2 text-[12px] font-bold uppercase text-slate-400 hover:text-slate-600 transition-all"
                  >
                    Trở lại
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default SettingsOverlay;
