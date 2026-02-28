export interface ITag {
  _id: string;
  name: string;
  slug: string;
  details: string;
  icon: {
    name: string;
    url: string;
  };
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
