import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../models/User.model';
import { Post } from '../../models/Post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  public user: User;
  public userSubscription: Subscription;
  public posts: Post[];
  public postsSubscription: Subscription;
  public isLikes: boolean;
  public isUsersLiked: boolean;
  public isUsersDislked: boolean;
  public loading: boolean;

  constructor(private formBuilder: FormBuilder, 
    private auth: AuthService, 
    private post: PostsService, 
    private router: Router, 
    private route: ActivatedRoute) { this.post.getAllPosts() }

  ngOnInit() {
    this.loading = true;
    
    // on souscrit à la valeur du subject "User" en tant qu'observable quand on initialise la page
    this.userSubscription = this.auth.getUser().subscribe((res: User) => {
      if (res !== undefined && res !== null) {
        this.user = res;
      }
    });

    // on souscrit à la valeur du subject "Post" en tant qu'observable quand on initialise la page
    this.postsSubscription = this.post.getPosts().subscribe((res: Post[]) => {
      if (res !== undefined && res !== null) {
        this.posts = res;
        this.loading = false;
      }
    });

    // on récupère les informations de l'utilisateur côté serveur
    const userId = this.auth.getUserId();
    if (userId) {
      this.auth.getUserServerId(+userId);
    }
  }

  ngOnDestroy() {
    // on se désabonne des soucriptions lorsqu'on quitte la page
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if(this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
