import { Component, OnInit, Input } from '@angular/core';
import {Comment} from '../models/Comment.model';
import { User } from '../models/User.model';
import { CommentService } from '../services/comment.service';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  // on récupère les variables user et comment du post.component
  @Input() public comments: Comment;
  @Input() public user: User;

  public liked: boolean;
  public disliked: boolean;
  public newComment: Comment;

  constructor(private comment: CommentService, private post: PostsService) { }

  ngOnInit() {
    // on traîte les données de la valeur usersLiked en objet JavaScript utilisable
    const updateUsersLiked = JSON.parse(this.comments.usersLiked);

    // on traîte les données de la valeur usersDisliked en objet JavaScript utilisable
    const updateUsersDisliked = JSON.parse(this.comments.usersDisliked);
    
    // on contrôle si l'utilisateur à déjà like ou dislike le commentaire
    if (updateUsersLiked.find(user => user === this.user.id)) {
      this.liked = true;
    } else if (updateUsersDisliked.find(user => user === this.user.id)) {
      this.disliked = true;
    }
  }

  // on supprime le commentaire
  onDeleteComment() {    
    this.comment.deleteComment(this.user.id, this.comments.id).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on recharge les posts
      this.post.getAllPosts();
    });
  }

  // on récupère le commentaire pour mettre à jours les likes/dislikes
  onUpdateLikesComment() {    
    this.comment.getOneComment(this.user.id, this.comments.id).subscribe((res) => {
      // on créé une nouvelle instance de Comment
      this.newComment = new Comment();
      this.newComment.likes = res.likes;
      this.newComment.dislikes = res.dislikes;

      // on met à jour la valeur des likes
      this.comments.likes = this.newComment.likes

      // on met à jour la valeur des dislikes
      this.comments.dislikes = this.newComment.dislikes
    });
  }

  // on like le commentaire
  onLike() {
    this.comment.likeComment(this.user.id, this.comments.id, !this.liked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.liked = !this.liked

      // on met à jour le commentaire
      this.onUpdateLikesComment();
    });
  }

  // on dislike le commentaire
  onDislike() {
    this.comment.dislikeComment(this.user.id, this.comments.id, !this.disliked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.disliked = !this.disliked

      // on met à jour le commentaire
      this.onUpdateLikesComment();
    });
  }
}