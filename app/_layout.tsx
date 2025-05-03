import { Stack, useRouter, useSegments } from "expo-router";
import "./globals.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "@/lib/SecureStorage";
import { clearUserInfo, setUserInfo } from "@/redux/slices/userSlice";
import { Provider } from "react-redux";
import { store, persistor, RootState } from "@/redux/store"; // Import your Redux store and persistor
import { PersistGate } from "redux-persist/integration/react";

function AuthChecker() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        dispatch(setUserInfo({ isAuthenticated: true }));
      } else {
        dispatch(clearUserInfo());
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthScreen) router.replace("/(auth)/login");
    else if (isAuthenticated && inAuthScreen) router.replace("/(tabs)");
  }, [segments, isAuthenticated]);

  return null;
}


export default function RootLayout() {
  

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <StatusBar style='dark' />
            <SafeScreen>
              <AuthChecker />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='(tabs)' />
                <Stack.Screen name='(auth)' />
                <Stack.Screen name='movies/[id]' />
              </Stack>
            </SafeScreen>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
