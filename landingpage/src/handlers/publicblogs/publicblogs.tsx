import ApiHandler from "../../helpers/ApiHandler";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

interface GetBlogParams {
  [key: string]: any; // Ideally, replace with specific keys and types when known
}

class PublicBlogs {
  private apiHandler: ApiHandler;

  constructor() {
    this.apiHandler = new ApiHandler();
  }

  async get<T = any>(params?: GetBlogParams): Promise<ApiResponse<T>> {
    const response = await this.apiHandler.request<T>({
      method: "GET",
      endpoint: "/blogs",
      has_token: false,
      params,
    });

    return response;
  }
}

export default PublicBlogs;
