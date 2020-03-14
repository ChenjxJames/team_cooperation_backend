interface Task {
  task_id: number;
  task_name: string;
  information: string;
  task_dealine: string;
  list_id: number;
  lane_id: number;
  order: number;

  have_sub_task: boolean;
  have_user: boolean;
  have_file: boolean;
  have_comment: boolean;
  have_tag: boolean;
}

export class TaskImpl implements Task {
  task_id: number = 0;
  task_name: string = '';
  information: string = '';
  task_dealine: string = '';
  list_id: number = 0;
  lane_id: number = 0;
  order: number = 0;
  have_sub_task: boolean = false;
  have_user: boolean = false;
  have_file: boolean = false;
  have_comment: boolean = false;
  have_tag: boolean = false;

  constructor() {
    
  }
}