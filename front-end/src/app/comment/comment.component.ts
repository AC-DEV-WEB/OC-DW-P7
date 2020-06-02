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

  constructor(private comment: CommentService, private post: PostsService) { }

  ngOnInit(): void {
  }

  // on supprime le commentaire
  onDeleteComment() {    
    this.comment.deleteComment(this.user.id, this.comments.id).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on recharge les posts
      this.post.getAllPosts();
    });
  }
}