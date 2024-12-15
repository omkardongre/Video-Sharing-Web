export enum SubscriptionPlan {
  PRO = "PRO",
  FREE = "FREE",
}

export enum WorkspaceType {
  PUBLIC = "PUBLIC",
  PERSONAL = "PERSONAL",
}

export type UserWorkspaceDetails = {
  subscription: {
    plan: SubscriptionPlan;
  } | null;
  workspace: {
    id: string;
    name: string;
    type: WorkspaceType;
  }[];
  members: {
    WorkSpace: {
      id: string;
      name: string;
      type: WorkspaceType;
    };
  }[];
};

export type UserWorkspaceResponse = {
  status: number;
  data: UserWorkspaceDetails;
};

export type NotificationProps = {
  // TODO : check this type again, it should be an array?
  status: number;
  data: {
    _count: {
      notification: number;
    };
  };
};

export type FolderProps = {
  // TODO : check this type again, it should be an array?
  status: number;
  data: {
    name: string;
    _count: {
      videos: number;
    };
  };
};

export type VideosProps = {
  status: number;
  data: {
    User: {
      firstName: string | null;
      lastName: string | null;
      image: string | null;
    } | null;
    id: string;
    processing: boolean;
    Folder: {
      id: string;
      name: string;
    } | null;
    createdAt: Date;
    title: string | null;
    source: string;
  }[];
};

export type FolderDetails = {
  id: string;
  name: string;
  createdAt: Date;
  workSpaceId: string | null;
  _count: {
    videos: number;
  };
};

export type WorkspaceFoldersResponse = {
  status: number;
  data: FolderDetails[];
};
