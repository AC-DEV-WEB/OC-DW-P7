import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  // on instancie un subject de type "Post" à la valeur null
  public postSubject = new BehaviorSubject<Post[]>(null);

  constructor(private http: HttpClient, private router: Router) { }

  // renvoie tous les posts depuis le serveur
  public getAllPosts() {
    this.http.get('http://localhost:3000/api/posts/').subscribe(
      (res: Post[]) => {
        this.setPosts(res);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // envoie une requête au serveur pour la création d'un nouveau post
  public createNewPost(userId: number, author: string, title: string, content: string, imageUrl?: File): Observable<any> {
    if (imageUrl) {
      // on créé une nouvelle instance de Post
      const newPost = new Post();

      newPost.userId = userId;
      newPost.author = author;
      newPost.title = title;
      newPost.content = content;

      // on formate les données
      const formData = new FormData();
      
      formData.append('post', JSON.stringify(newPost));
      formData.append('image', imageUrl);

      return this.http.post<any>('http://localhost:3000/api/posts/create/', formData);
    } else {
      // on créé une nouvelle instance de Post
      const newPost = new Post();

      newPost.userId = userId;
      newPost.author = author;
      newPost.title = title;
      newPost.content = content;

      // on formate les données
      const formData = new FormData();

      formData.append('post', JSON.stringify(newPost));

      return this.http.post<any>('http://localhost:3000/api/posts/create/', formData);
    }
  }

  // envoie une requête au serveur pour la supression du post et de ses commentaires
  //
  // id: userId
  // postId: postId
  public deletePost(id: number, postId: number): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/api/posts/delete/'+id+'/'+postId);
  }

  // on transforme le subject "Post" en observable
  public getPosts(): Observable<Post[]> {
    return this.postSubject.asObservable();
  }

  // on met à jour le subject "Post"
  public setPosts(posts: Post[]) {
    this.postSubject.next(posts);
  }
}
