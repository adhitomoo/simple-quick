export interface TagModel
{
  uuid?: string;
  title?: string;
  color?: string;
}

export interface TaskModel {
  uuid: string;
  title: string;
  tags?: TagModel[]
  done?: boolean
  dueDate?: Date | string | null
  countDate?: string
  priority?: number
  description: string
}
