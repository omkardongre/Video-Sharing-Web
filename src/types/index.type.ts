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
      firstName: string;
      lastName: string;
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

export type VideoDetails = {
  id: string;
  title: string | null;
  createdAt: Date;
  source: string;
  processing: boolean;
  Folder: {
    id: string;
    name: string;
  } | null;
  User: {
    firstName: string;
    lastName: string;
    image: string | null;
  } | null;
};

export type WorkspaceVideosResponse = { status: number; data: VideoDetails[] };

export type VideoProps = {
  status: number;
  data: {
    User: {
      firstName: string;
      lastName: string;
      image: string | null;
      clerkId: string;
      trial: boolean;
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
    title: string | null;
    description: string | null;
    source: string;
    views: number;
    createdAt: Date;
    processing: boolean;
    summary: string;
  };
  author: boolean;
};

export type NotificationDetails = {
  id: string;
  userId: string | null;
  content: string;
};

export type NotificationCount = {
  notification: NotificationDetails[];
  _count: {
    notification: number;
  };
};

export type NotificationResponse = {
  status: number;
  data: NotificationCount;
};

export type UserDetails = {
  id: string;
  subscription: {
    plan: "PRO" | "FREE";
  } | null;
  firstName: string;
  lastName: string;
  image: string | null;
  email: string | null;
};

export type CommentRepliesProps = {
  id: string;
  content: string;
  createdAt: Date;
  parentCommentId: string | null;
  userId: string | null;
  videoId: string | null;
  User: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    clerkId: string;
    image: string | null;
    trial: boolean;
    firstView: boolean;
  };
};

export type VideoCommentProps = {
  data: {
    User: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      clerkId: string;
      image: string | null;
      trial: boolean;
      firstView: boolean;
    };
    reply: CommentRepliesProps[];
    id: string;
    comment: string;
    createdAt: Date;
    parentCommentId: string | null;
    userId: string | null;
    videoId: string | null;
  }[];
};
