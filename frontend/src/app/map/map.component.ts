import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RegisterService } from '../services/register.service';
import { Registration } from '../models/registration';
import * as L from 'leaflet';
import { MapService } from '../services/map.service';
import { Map } from '../models/map';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notifications';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit,OnDestroy {
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(!this.user || this.user.accepted==false){
      this.router.navigate(['']);
    }
    this.mapService.fetchAll().subscribe((data:Map[])=>{
      this.marks=data;
      this.initMap();

    });
    window.addEventListener('beforeunload', localStorage.clear);
    this.registerService.fetchAll().subscribe((data:Registration)=>{
      if(data){
        this.openForOrganizers=data.openForOrganizers;
        this.openForParticipants=data.openForParticipants;
        this.openForForeings=data.openForForeings;
      }
  });
  this.notificationService.fetchAll().subscribe((data:Notification[])=>{
    this.notifications=data;
    if(this.notifications.length>0){

    let unreadNotifications=this.notifications.filter((n)=> !n.read.includes(this.user.email));
    this.read=unreadNotifications.length==0;
    }
  });
  this.subscription=timer(0,60000).subscribe(()=>{
    this.notificationService.fetchAll().subscribe((data:Notification[])=>{
      this.notifications=data;
      this.read=this.notifications.filter((n)=>!n.read.includes(this.user.email)).length==0;
    });
  });
  }
  constructor(private router:Router,private registerService:RegisterService,private mapService:MapService,private notificationService:NotificationService) { }
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    window.removeEventListener('beforeunload', localStorage.clear);
  }


  goToProfile(){
    this.router.navigate(['profil']);
  }

  goToMap(){
    this.router.navigate(['map']);
  }
  goToNews(){
    this.router.navigate(['news']);
  }

  goToNotifications(){
    this.router.navigate(['notifications']);
  }
  goToAgenda(){
    this.router.navigate(['agenda']);
  }
  goToApply(){
    this.router.navigate(['apply']);
  }
  logout(){
    localStorage.removeItem('loggedInUser');
     this.router.navigate(['']);
  }

  determineApply():boolean{
    if(this.user.type=='admin'){
      return true;
    }
    if(this.user.type=='organizator' && this.openForOrganizers){
      return true;
    }
    if(this.user.type=='ucesnik' && this.user.country=="Srbija" && this.openForParticipants){
      return true;
    }
    if(this.user.type=='ucesnik' && this.openForForeings){
      return true;
    }
    return false;
  }

  user:User;
  openForOrganizers:boolean=false;
  openForParticipants:boolean=false;
  openForForeings:boolean=false;
  marks:Map[]=[];

  latitude:number=0;
  longitude:number=0;
  label:string="";
  errorLabel:string="";
  errorLatitude:string="";
  errorLongitude:string="";

  deleteM:string="";
  errorMark:string="";

  notifications:Notification[]=[];
  read:boolean=true;
  subscription:Subscription;


  deleteMark(){
    this.errorMark="";
    if(this.deleteM==""){
      this.errorMark="Obavezno polje";
      return;
    }

    this.mapService.deleteMark(this.deleteM).subscribe((data)=>{
      if(data['message']=='ok'){
        this.marks=this.marks.filter((mark)=>mark.label!=this.deleteM);
        const markerToRemove = this.markers[this.deleteM];
    if (markerToRemove) {
      this.map.removeLayer(markerToRemove); // Remove from map
      delete this.markers[this.deleteM]; // Remove from markers object
    }
        this.deleteM="";
      }
    });

  }

  addMark(){
    this.errorLabel="";
    this.errorLatitude="";
    this.errorLongitude="";
    let valid=true;
    if(this.label==""){
      this.errorLabel="Obavezno polje";
      valid=false;
    }
    if(this.latitude==0){
      this.errorLatitude="Obavezno polje";
      valid=false;
    }
    if(this.longitude==0){
      this.errorLongitude="Obavezno polje";
      valid=false;
    }
    if(valid){

    this.mapService.addMark(this.longitude,this.latitude,this.label).subscribe((data)=>{
      if(data['message']=='ok'){
        console.log('ok');
        this.addMarker([this.longitude,this.latitude],this.label);
        this.label="";
        this.latitude=0;
        this.longitude=0;
        window.location.reload();
    }

    });
  }
}

  private map;
  private markers: { [key: string]: L.Marker } = {}; // Object to store markers

  private initMap(): void {
    this.map = L.map('map', {
      center: [43.7247, 19.6924], // Default center (Zlatibor coordinates)
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);
    // Initialize markers (e.g., Ratko Mitrovic and Milky)
    this.marks.forEach((mark)=>{
      this.addMarker([mark.longitude,mark.latitude],mark.label);
    });
  }
  customIcon = L.icon({
    iconUrl: 'assets/pin.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
  });
  private addMarker(coordinates: [number, number], label: string): void {

    console.log()
    const newMarker = L.marker(coordinates,{icon:this.customIcon}).addTo(this.map)
        .bindPopup(label)
        .openPopup();
      this.markers[label] = newMarker; // Store reference
  }


}
