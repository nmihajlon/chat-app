import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpdate = (e: any) => {
    console.log(e);
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string | null;
      setSelectedImage(base64Image);
      await updateProfile({profilePic: base64Image});
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser?.profilePic || "avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                className={`absolute bottom-0 right-0 rounded-full bg-base-content hover:scale-105 p-2 cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
                htmlFor="avatar-upload"
              >
                <Camera className="size-5 text-primary" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpdate}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Updating..."
                : "Check the camera icon to update your profile photo"}
            </p>

            <div className="space-y-6 w-full">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="size-4" />
                  <span className="font-bold">Full Name</span>
                </div>
                <p className="text-sm px-4 py-2.5 bg-base-200 rounded-xl border border-zinc-600">
                  {authUser?.fullName}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="size-4" />
                  <span className="font-bold">Email address</span>
                </div>
                <p className="text-sm px-4 py-2.5 bg-base-200 rounded-xl border border-zinc-600">
                  {authUser?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
