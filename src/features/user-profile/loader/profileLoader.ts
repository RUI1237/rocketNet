import { useAuthStore } from "@/features/auth";
import { profileService } from "../services/profile.service";

export function profileLoader() {
  const user = useAuthStore.getState().user;
  if (!user?.username) {
    return { userInfo: Promise.resolve(null) };
  }
  const userInfoPromise = profileService.getUserInfo(user.username);
  return { userInfo: userInfoPromise };
}
