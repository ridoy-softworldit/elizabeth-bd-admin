export interface ReviewUser {
  _id: string;
  name: string;
  email: string;
}

export interface ReviewProduct {
  _id: string;
  description: {
    name: string;
  };
}

export interface Review {
  _id: string;
  user: ReviewUser;
  product: ReviewProduct;
  rating: number;
  description: string;
  photos: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Update Review এর জন্য Type
export interface UpdateReviewData {
  rating: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  photos?: File[];
}
