export class ExerciseDto {
  constructor(
    public name: string,
    public description: string,
    public calories: string,
    public youtube: string,
    public id?: string,
  ) { }
}

export interface ExercisePageDto {
  exercises: ExerciseDto[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
