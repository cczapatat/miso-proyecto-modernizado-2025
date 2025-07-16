export class UserDto {
  constructor(
    public name: string,
    public last_name: string,
    public age: number,
    public height: number,
    public weight: number,
    public arm: number,
    public chest: number,
    public waist: number,
    public leg: number,
    public created_at?: string,
    public updated_at?: string,
    public withdrawal_date?: string,
    public withdrawal_reason?: string,
    public id?: number,
  ) { }
}

export interface UserPageDto {
  users: UserDto[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}