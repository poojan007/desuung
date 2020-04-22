import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Platform, ToastController, NavController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Qrmodel } from '../model/qrmodel';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-scanqr',
  templateUrl: './scanqr.page.html',
  styleUrls: ['./scanqr.page.scss'],
})
export class ScanqrPage implements OnInit {

  private preventBack: Subscription;
  status: string;
  message: string;
  scannedData: any;
  userId: number;
  qrData: Qrmodel;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private platform: Platform,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private apiService: ApiService,
    private authService: AuthenticationService
  ) {
    this.qrData = new Qrmodel();
  }

  ngOnInit() {
    const userData = JSON.parse(this.authService.getItem('USER_INFO'));
    this.userId = userData.userId;
    this.scanQRCode();
  }

  scanQRCode() {
    this.preventBack = this.platform.backButton.subscribeWithPriority(9999, () => {});
    this.barcodeScanner.scan().then((barcodeData) => {
        if (barcodeData.cancelled) {
            return;
        }
        this.navCtrl.pop();
        this.scannedData = barcodeData;
        this.sendAttendance();
    }, (err) => {
        console.error(err);
    }).finally(() => {
        window.setTimeout(() => {
            this.preventBack.unsubscribe();
        }, 1000);
    });
  }

  sendAttendance() {
    this.qrData.id = this.scannedData.id;
    this.qrData.uid = this.userId;
    this.apiService.postQRCodeAttendance(this.qrData).subscribe((response) => {
      if (response.RESULT === 'SUCCESS') {
        this.status = 'Success';
        this.message = 'Your attendance has been successfully record';
      } else {
        this.status = 'Failure';
        this.message = 'Your attendance couldnot be recorded, please try again';
      }

      this.presentAlert();
    });
  }

  async presentAlert() {
      const alert = await this.alertCtrl.create({
      header: this.status.toUpperCase(),
      message: this.message,
      buttons: ['OK']
    });
      await alert.present();
  }
}