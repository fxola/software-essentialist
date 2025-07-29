import axios from "axios";
import { APIResponse, GenericErrors, handleAPIError } from ".";
import { User } from "./users";
type GetPostsErrors = GenericErrors;

export interface Vote {
  id: number;
  postId: number;
  memberId: number;
  voteType: string;
}

export interface Comment {
  id: number;
  postId: number;
  text: string;
  memberId: number;
  parentCommentId: number | null;
}

export interface MemberPostedBy {
  id: number;
  userId: number;
  user: User;
}

export interface Post {
  id: number;
  memberId: number;
  postType: string;
  title: string;
  content: string;
  dateCreated: string;

  votes: Vote[];
  comments: Comment[];
  memberPostedBy: MemberPostedBy;
}

interface Posts {
  posts: Post[];
}

type GetPostsFilter = "recent";
type GetPostsAPIResponse = APIResponse<Posts, GetPostsErrors>;

export const createPostAPI = (baseURL: string) => {
  return {
    get: async (sort: GetPostsFilter): Promise<GetPostsAPIResponse> => {
      try {
        const response = await axios.get(`${baseURL}posts?sort=${sort}`);
        return response.data;
      } catch (e) {
        return handleAPIError<GetPostsAPIResponse>(e);
      }
    },
  };
};
