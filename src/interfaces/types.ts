export interface ProductType {
  id: number;
  name: string;
  price: number;
  slug: string;
  items: [];
  links: [];
}

export interface ProductVariant {
  id: number;
  colorValue: string;
  colorName: string;
  sizes: string[];
  price: number | string;
  stock: number;
  images: string[];
  removedImages: string[];
  discountType: string | null;
  discount: number | string;
  colorOption: string | null;
}

export interface CartProduct {
  id: number;
  name: string;
  imgUrl: string;
  colorName: string;
  colorValue: string;
  size: string;
  price: number;
  quantity: number;
}
