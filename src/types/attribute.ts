export interface IAttributeValue {
  value: string;
  meta: string;
}

export interface IAttribute {
  _id: string;
  name: string;
  slug: string;
  attributes: IAttributeValue[];
  createdAt: string; 
  updatedAt: string; 
}
