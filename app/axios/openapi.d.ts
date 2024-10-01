import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Schemas {
        export interface CreateProductDto {
            name: string;
            price: number;
        }
        export interface GetProductsResponseDto {
            products: ProductClass[];
            count: number;
        }
        export interface GetReceiptResponseDto {
            id: number;
            name: string;
            createdAt: string; // date-time
            isDeleted: boolean;
            userId: string;
            updatedAt: string; // date-time
            totalPrice: number;
            items: ReceiptItem[];
        }
        export interface Item {
            name: string;
            price: number;
            quantity: number;
        }
        export interface ProductClass {
            id: number;
            createdAt: string; // date-time
            updatedAt: string; // date-time
            isDeleted: boolean;
            name: string;
            price: number;
            userId: string;
        }
        export interface ReceiptItem {
            id: number;
            name: string;
            price: number;
            quantity: number;
            receiptId: number;
        }
        export interface ReqCreateReceiptsDto {
            name: string;
            items: Item[];
            newProductsNames?: string[];
            modifiedProductsNames?: string[];
        }
        export interface UpdateProductDto {
            name?: string;
            price?: number;
        }
    }
}
declare namespace Paths {
    namespace ProductsCreate {
        export type RequestBody = Components.Schemas.CreateProductDto;
        namespace Responses {
            export interface $201 {
            }
            export interface $401 {
            }
        }
    }
    namespace ProductsFindAll {
        namespace Parameters {
            export type Page = number;
            export type RowsPerPage = number;
        }
        export interface QueryParameters {
            page?: Parameters.Page;
            rowsPerPage?: Parameters.RowsPerPage;
        }
        namespace Responses {
            export type $200 = Components.Schemas.GetProductsResponseDto;
            export interface $401 {
            }
        }
    }
    namespace ProductsRemove {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
            }
            export interface $401 {
            }
        }
    }
    namespace ProductsUpdate {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = Components.Schemas.UpdateProductDto;
        namespace Responses {
            export interface $200 {
            }
            export interface $401 {
            }
        }
    }
    namespace ReceiptsCreate {
        export type RequestBody = Components.Schemas.ReqCreateReceiptsDto;
        namespace Responses {
            export interface $201 {
            }
            export interface $401 {
            }
        }
    }
    namespace ReceiptsFindAll {
        namespace Responses {
            export type $200 = Components.Schemas.GetReceiptResponseDto[];
            export interface $401 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * productsFindAll
   */
  'productsFindAll'(
    parameters?: Parameters<Paths.ProductsFindAll.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ProductsFindAll.Responses.$200>
  /**
   * productsCreate
   */
  'productsCreate'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ProductsCreate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ProductsCreate.Responses.$201>
  /**
   * productsUpdate
   */
  'productsUpdate'(
    parameters?: Parameters<Paths.ProductsUpdate.PathParameters> | null,
    data?: Paths.ProductsUpdate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ProductsUpdate.Responses.$200>
  /**
   * productsRemove
   */
  'productsRemove'(
    parameters?: Parameters<Paths.ProductsRemove.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ProductsRemove.Responses.$200>
  /**
   * receiptsFindAll
   */
  'receiptsFindAll'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ReceiptsFindAll.Responses.$200>
  /**
   * receiptsCreate
   */
  'receiptsCreate'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ReceiptsCreate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ReceiptsCreate.Responses.$201>
}

export interface PathsDictionary {
  ['/products']: {
    /**
     * productsCreate
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ProductsCreate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ProductsCreate.Responses.$201>
    /**
     * productsFindAll
     */
    'get'(
      parameters?: Parameters<Paths.ProductsFindAll.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ProductsFindAll.Responses.$200>
  }
  ['/products/{id}']: {
    /**
     * productsUpdate
     */
    'patch'(
      parameters?: Parameters<Paths.ProductsUpdate.PathParameters> | null,
      data?: Paths.ProductsUpdate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ProductsUpdate.Responses.$200>
    /**
     * productsRemove
     */
    'delete'(
      parameters?: Parameters<Paths.ProductsRemove.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ProductsRemove.Responses.$200>
  }
  ['/receipts']: {
    /**
     * receiptsCreate
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ReceiptsCreate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ReceiptsCreate.Responses.$201>
    /**
     * receiptsFindAll
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ReceiptsFindAll.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>

export type CreateProductDto = Components.Schemas.CreateProductDto;
export type GetProductsResponseDto = Components.Schemas.GetProductsResponseDto;
export type GetReceiptResponseDto = Components.Schemas.GetReceiptResponseDto;
export type Item = Components.Schemas.Item;
export type ProductClass = Components.Schemas.ProductClass;
export type ReceiptItem = Components.Schemas.ReceiptItem;
export type ReqCreateReceiptsDto = Components.Schemas.ReqCreateReceiptsDto;
export type UpdateProductDto = Components.Schemas.UpdateProductDto;
