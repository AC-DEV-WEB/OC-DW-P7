import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/Post.model';
import { User } from '../models/User.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { PostsService } from '../services/posts.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  // on recupère les variables user et post du posts.component
  @Input() public posts: Post;
  @Input() public user: User;

  public commentForm: FormGroup;
  public showModal: boolean;
  public showComment: boolean;
  public liked: boolean;
  public disliked: boolean;
  public newPost: Post;

  constructor(private formBuilder: FormBuilder, private comment: CommentService, private post: PostsService, private auth: AuthService, private router: Router) { }

  ngOnInit() {    
    // on initialise les données du formulaire pour la publication d'un nouveau commentaire
    this.commentForm = this.formBuilder.group({
      comments: ['', Validators.required]
    });

    // on cache le modal
    this.showModal = false;

    // on cache les commentaires
    this.showComment = false;

    // on traîte les données de la valeur usersLiked en objet JavaScript utilisable
    const updateUsersLiked = JSON.parse(this.posts.usersLiked);

    // on traîte les données de la valeur usersDisliked en objet JavaScript utilisable
    const updateUsersDisliked = JSON.parse(this.posts.usersDisliked);
    
    // on contrôle si l'utilisateur à déjà like ou dislike le post
    if (updateUsersLiked.find(user => user === this.user.id)) {
      this.liked = true;
    } else if (updateUsersDisliked.find(user => user === this.user.id)) {
      this.disliked = true;
    }
  }

  // on affiche le modal
  onShowModal() {
    this.showModal = true;
  }
  
  // on cache le modal
  onCloseModal() {
    this.showModal = false;
  }

  // on ajoute le nouveau commentaire
  onCreateComment() {
    const author = this.user.firstName +' '+ this.user.lastName;
    const comments = this.commentForm.get('comments').value;

    this.comment.createNewComment(this.user.id, this.posts.id, author, comments).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on ferme le modal
      this.showModal = false;

      // on recharge les posts
      this.post.getAllPosts();
    });
  }

  // affiche/cache les commentaires
  onShowComment() {
    this.showComment = !this.showComment;
  }

  // on annule la création du commentaire
  onCancelComment(event: Event) {
    event.stopPropagation();
  }

  // on supprime le post
  onDeletePost() {
    this.post.deletePost(this.user.id, this.posts.id).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on recharge les posts
      this.post.getAllPosts();
    });
  }

  // on vérifie s'il s'agit d'une image ou d'une vidéo
  isFileImage(filename) {
    let ext = filename.split('.').pop();

    if (ext === 'webm') {
      return true
    } else {
      return false 
    }
  }

  // on met au pluriel le mot s'il y a plusieurs commentaires
  isManyComment() {
    if (this.posts.Comments.length < 2) {
      return 'commentaire'
    } else {
      return 'commentaires'
    }
  }

  // on récupère le post pour mettre à jours les likes/dislikes
  onUpdateLikesPost() {    
    this.post.getOnePost(this.user.id, this.posts.id).subscribe((res) => {
      // on créé une nouvelle instance de Post
      this.newPost = new Post();
      this.newPost.likes = res.likes;
      this.newPost.dislikes = res.dislikes;

      // on met à jour la valeur des likes
      this.posts.likes = this.newPost.likes

      // on met à jour la valeur des dislikes
      this.posts.dislikes = this.newPost.dislikes
    });
  }

  // on like le post
  onLike() {
    this.post.likePost(this.user.id, this.posts.id, !this.liked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.liked = !this.liked

      // on met à jour le post
      this.onUpdateLikesPost();
    });
  }

  // on dislike le post
  onDislike() {
    this.post.dislikePost(this.user.id, this.posts.id, !this.disliked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.disliked = !this.disliked

      // on met à jour le post
      this.onUpdateLikesPost();
    });
  }
}