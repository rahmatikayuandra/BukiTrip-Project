// constants/api.ts

export const API_BASE_URL = "http://localhost:8888/BukiTrip/api";

export type LoginResponseUser = {
  user_id: number;
  name: string;
  email: string;
  username: string;
};

export type LoginResponse =
  | {
      status: "success";
      message: string;
      user: LoginResponseUser;
    }
  | {
      status: "error";
      message: string;
    };

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  return json as LoginResponse;
}

// ===== REGISTER =====

export type RegisterResponse = LoginResponse; // struktur sama2 status + message + user

export async function registerUser(params: {
  name: string;
  email: string;
  username: string;
  password: string;
}): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE_URL}/register.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const json = await res.json();
  return json as RegisterResponse;
}

// ==== DESTINATIONS ====

export type Destination = {
  destination_id: number;
  destination_name: string;
  price_adult: string;   // dari PHP akan datang sebagai string
  price_child: string;
  rating: string | null;
  image_url: string | null;
  status: "Open" | "Closed";
  address: string | null;
  description: string | null;
  category?: string | null;   // <=== TAMBAHAN
};

export type DestinationsResponse =
  | {
      status: "success";
      data: Destination[];
    }
  | {
      status: "error";
      message: string;
    };

export async function getDestinations(): Promise<DestinationsResponse> {
  const res = await fetch(`${API_BASE_URL}/get_destinations.php`);
  const json = await res.json();
  return json as DestinationsResponse;
}