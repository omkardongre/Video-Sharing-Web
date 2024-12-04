enum SUBSCRIPTION_PLAN {
  PRO,
  FREE,
}

enum WorkSpaceType {
  PUBLIC,
  PERSONAL,
}

export type WorkspaceProps = {
  data: {
    subscription: {
      plan: SUBSCRIPTION_PLAN;
    } | null;
    workspace: {
      id: string;
      name: string;
      type: WorkSpaceType;
    }[];
    members: {
      WorkSpace: {
        id: string;
        name: string;
        type: WorkSpaceType;
      };
    }[];
  };
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
