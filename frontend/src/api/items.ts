import { apiClient } from "./client";

export interface Item {
  id: number;
  name: string;
  value: number;
}

export interface ItemsResponse {
  data: Item[];
  total: number;
  timestamp: string;
}

export interface ItemResponse {
  item: Item;
  timestamp: string;
}

export const itemsApi = {
  getAll: async (): Promise<ItemsResponse> => {
    const response = await apiClient.get<ItemsResponse>("/items/");

    return response.data;
  },

  getById: async (id: number): Promise<ItemResponse> => {
    const response = await apiClient.get<ItemResponse>(
      `/items/${id}`
    );

    return response.data;
  },
};