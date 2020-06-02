export class Post {
  public id: number;
  public userId: number;
  public author: string;
  public title: string;
  public content: string;
  public Comments: Comment[];
  public imageUrl: string;
  public likes: number;
  public dislikes: number;
  public usersLiked: string;
  public usersDisliked: string;
  public createdAt: string;
}