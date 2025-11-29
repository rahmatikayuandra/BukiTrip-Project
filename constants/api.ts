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
  price_adult: string;
  price_child: string;
  rating: string | null;
  image_url: string | null;
  status: "Open" | "Closed";
  address: string | null;
  description: string | null;

  // optional (dipakai di detail)
  opening_time?: string | null;
  closing_time?: string | null;
  category?: string | null;
};

export type Review = {
  review_id: number;
  rating: number;
  comment: string | null;
  review_date: string;
  user_name: string;
  profil_pic: string | null;
};

export type DestinationDetailResponse =
  | {
      status: "success";
      destination: Destination;
      images: string[];
      reviews: Review[];
      related: Destination[];
    }
  | {
      status: "error";
      message: string;
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

export async function getDestinationDetail(
  destinationId: number
): Promise<DestinationDetailResponse> {
  const res = await fetch(
    `${API_BASE_URL}/get_destination_detail.php?id=${destinationId}`
  );

  // 1. Baca sebagai teks dulu
  const raw = await res.text();
  console.log("DETAIL RAW RESPONSE:", raw);

  // 2. Bersihin BOM + spasi di awal
  const cleaned = raw.replace(/^\uFEFF/, "").trimStart();

  // 3. Parse manual
  try {
    return JSON.parse(cleaned) as DestinationDetailResponse;
  } catch (e) {
    console.error("Gagal parse JSON detail:", e, cleaned);
    throw e; // biar ketangkap di try/catch screen detail
  }
}