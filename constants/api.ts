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

// ==== VOUCHER ====

export type Voucher = {
  voucher_id: number;
  voucher_code: string;
  voucher_name: string;
  description: string | null;
  discount: string; // dari PHP sebagai string
  start_date: string | null;
  end_date: string | null;
  destination_id: number | null;
};

export type VouchersResponse =
  | { status: "success"; data: Voucher[] }
  | { status: "error"; message: string };

export async function getVouchers(
  destinationId?: number
): Promise<VouchersResponse> {
  const query = destinationId
    ? `?destination_id=${destinationId}`
    : "";
  const res = await fetch(`${API_BASE_URL}/get_vouchers.php${query}`);
  const json = await res.json();
  return json as VouchersResponse;
}

// ==== ORDER ====


export type PaymentMethod = "QRIS" | "e-wallet" | "Bank Transfer" | "COD";

export type CreateOrderResponse =
  | {
      status: "success";
      message: string;
      order_id: number;
    }
  | {
      status: "error";
      message: string;
    };

export async function createOrder(payload: {
  user_id: number;
  destination_id: number;
  visit_date: string; // "YYYY-MM-DD"
  adult_quantity: number;
  child_quantity: number;
  payment_method: PaymentMethod;
  voucher_id: number | null;
}): Promise<CreateOrderResponse & { error?: string }> {
  const res = await fetch(`${API_BASE_URL}/create_order.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  console.log("CREATE_ORDER RAW:", raw);

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.error("Gagal parse JSON create_order:", e, raw);
    throw e;
  }

  return json as CreateOrderResponse & { error?: string };
}

// --- ORDERS ---

export type OrderSummary = {
  order_id: number;
  destination_id: number;
  destination_name: string;
  image_url: string | null;
  address: string | null;
  visit_date: string;
  adult_quantity: number;
  child_quantity: number;
  total_amount: string; // akan datang sebagai string
  status: "ongoing" | "finished" | "cancelled";
  payment_method: PaymentMethod;
};

export type OrderDetail = {
  order_id: number;
  user_id: number;
  destination_id: number;
  destination_name: string;
  address: string | null;
  image_url: string | null;
  visit_date: string;
  adult_quantity: number;
  child_quantity: number;
  payment_method: PaymentMethod;
  voucher_id: number | null;
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  status: "ongoing" | "finished" | "cancelled";
};

export type OrdersResponse =
  | { status: "success"; data: OrderSummary[] }
  | { status: "error"; message: string };

export type OrderDetailResponse =
  | { status: "success"; order: OrderDetail }
  | { status: "error"; message: string };

export async function getOrders(
  userId: number,
  status: "ongoing" | "finished"
): Promise<OrdersResponse> {
  const res = await fetch(
    `${API_BASE_URL}/get_orders.php?user_id=${userId}&status=${status}`
  );
  const json = await res.json();
  return json as OrdersResponse;
}

export async function getOrderDetail(
  orderId: number
): Promise<OrderDetailResponse> {
  const res = await fetch(
    `${API_BASE_URL}/get_order_detail.php?order_id=${orderId}`
  );
  const json = await res.json();
  return json as OrderDetailResponse;
}

// update status
export async function updateOrderStatus(orderId: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/update_order_status.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, status }),
  });
  return (await res.json()) as { status: "success" | "error"; message: string };
}

// --- REVIEW dari order ---

export async function submitReview(params: {
  user_id: number;
  order_id: number;
  rating: number;
  comment: string;
}) {
  const res = await fetch(`${API_BASE_URL}/create_review.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return (await res.json()) as { status: "success" | "error"; message: string };
}

export type EventItem = {
  event_id: number;
  event_name: string;
  start_date: string;
  end_date: string;
  description: string | null;
  image_url: string | null;
  status: "Upcoming" | "Ongoing" | "Finished";
  destination_id: number;

  destination_name: string;
  dest_image: string | null;
  address: string | null;
};

export type EventsResponse =
  | { status: "success"; data: EventItem[] }
  | { status: "error"; message: string };

export async function getEvents(): Promise<EventsResponse> {
  const res = await fetch(`${API_BASE_URL}/get_events.php`);
  const json = await res.json();
  return json as EventsResponse;
}