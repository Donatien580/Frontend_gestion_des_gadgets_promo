/** Miroir de org.springframework.data.domain.Page<T> côté backend. */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
