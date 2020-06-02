import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Comment } from '../models/Comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private router: Router) { }

  // envoie une requête au serveur pour la création d'un nouveau commentaire
  public createNewComment(userId: number, postId: number, author: string, comments: string): Observable<any> {
    // on créé une nouvelle instance de Comment
    const newComment = new Comment();

    newComment.userId = userId;
    newComment.postId = postId;
    newComment.author = author;
    newComment.comments = comments;

    return this.http.post<any>('http://localhost:3000/api/comment/create/', { comment: newComment });
  }

  // envoie une requête au serveur pour la supression du commentaire
  //
  // id: userID
  // commentId: commentId
  public deleteComment(id: number, commentId: number): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/api/comment/delete/'+id+'/'+commentId);
  }
}
