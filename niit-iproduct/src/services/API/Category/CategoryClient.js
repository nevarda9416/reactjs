import AxiosClient from "../AxiosClient";

const CategoryClient = {
  getAll: () => {
    return AxiosClient.get(`/categories`);
  },
  getById: (id) => {
    return AxiosClient.get(`/categories/edit/${id}`);
  },
  delete: (id) => {

  },
  deleteMany: (id) => {

  },
  create: (params) => {

  },
  update: (id, params) => {

  }
};
export default CategoryClient;
