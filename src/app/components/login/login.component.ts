import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; //Esto se importa para hacer operaciones con la url
import {User} from '../../models/user';
import{UserService} from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  
  public page_title:string;
  public user: User;
  public status:string;
  public token;
  public identity

  constructor(
    private _userService:UserService, 
    private _router: Router,
    private route: ActivatedRoute
    ) {
    this.page_title = 'Identificate';
    this.user = new User(1, '','','ROLE_USER', '', '','', '');
   }

  ngOnInit() {
    //Se ejecuta siempre y cierra sesion solo cuando le llega el parametro sure por la url
    this.logout();
  }

  onSubmit(form){
    this._userService.signup(this.user).subscribe(
      response =>{
        //TOKEN
        if(response.status != 'error'){
          this.status='success';
          this.token= response;

        //OBJETO USUARIO IDENTIFICADO
        this._userService.signup(this.user, true).subscribe(
          response =>{
              this.identity= response
              //Persistir datos del usuario
              console.log(this.token);      
              console.log(this.identity);
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));  

              //Redirigir al inicio
              this._router.navigate(['/inicio']);
          },
          error =>{
            this.status='error';
            console.log(<any>error);
          }
        );

        }else{
          this.status='error';
          form.reset();
        }
      },
      error =>{
        console.log(<any>error);
        this.status='error';
      }
    );
  }

  logout(){
    this.route.params.subscribe(params=>{
      let logout = +params['sure']; //Poniendole el + lo pasa de string a tipo de dato entero
      if(logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity=null;
        this.token=null;

        //Redireccion a Inicio
        this._router.navigate(['inicio']); //Este metodo le indico la ruta que quiero ir y listo
      }
    });
  }

}
