import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ClubsDbService } from 'src/app/data/clubs.db.service';
import { ProductsDbService } from 'src/app/data/products.db.service';
import { PurchasesDbService } from 'src/app/data/purchases.db.service';
import { Club } from 'src/app/models/club.model';
import { Product } from 'src/app/models/product.model';
import { Purchase } from 'src/app/models/purchase.model';
import { constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatsComponent implements OnInit {

  lastMonthSelectedId: number = 0;
  lastMonthsActive: number = 0;

  fromDate: Date;
  toDate: Date;

  clubs: Club[] = [];
  products: Product[] = [];
  purchases: Purchase[] = [];
  stats: any[] = [];

  barChartOptions: EChartsOption;
  pieChartOptions: EChartsOption;

  constructor(
    private clubsDbService: ClubsDbService,
    private productsDbService: ProductsDbService,
    private purchaseDbService: PurchasesDbService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productsDbService.findAllProducts()
      .then(products => {
        this.products = products;
        this.loadPurchases(1);
      })
      .catch(error => console.log("Cannot fetch products from DB :: " + error));
  }

  loadPurchases(monthsBack: number) {
    if (monthsBack == -1) {
      this.purchaseDbService.findAllPurchases()
        .then(purchases => {
          this.purchases = purchases;
          this.refreshStats();
          this.refreshBarChart();
          this.getPieChartData();
        })
        .catch(error => console.log("Cannot fetch purchases from DB ::" + error));
    } else {

      this.fromDate = new Date();
      this.fromDate.setMonth(this.fromDate.getMonth() - monthsBack);
      this.toDate = new Date();

      let fromDateString = this.datePipe.transform(this.fromDate, constants.dateFormat);
      let toDateString = this.datePipe.transform(this.toDate, constants.dateFormat);
      this.purchaseDbService.findAllPurchasesByDate(fromDateString, toDateString)
        .then(purchases => {
          this.purchases = purchases;
          this.refreshStats();
          this.refreshBarChart();
          this.getPieChartData();
        })
        .catch(error => console.log("Cannot fetch purchases from DB ::" + error));
    }
  }

  refreshStats() {
    this.stats = [];
    this.products.forEach(product => {
      let totalCount = this.purchases.filter(purchase => purchase.productId == product.id).reduce((a, b) => a + (b.quantity || 0), 0);
      this.stats.push({
        product: product.name,
        count: totalCount
      });
    });
  }

  refreshBarChart() {
    let productNames = this.stats.map(stat => stat.product);
    let chartData = this.stats.map(stat => stat.count);
    this.barChartOptions = {
      title: {
        text: 'Общо поръчки'
      },
      color: ['#00567a'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'category',
          data: productNames,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      xAxis: [{
        type: 'value'
      }],
      series: [{
        name: 'Продажби',
        type: 'bar',
        barWidth: '30%',
        data: chartData
      }]
    };
  }

  refreshPieChartData() {
    let chartData: any[] = [];
    this.clubs.forEach(club => {
      let totalCount = this.purchases.filter(purchase => purchase.clubId = club.id).reduce((a, b) => a + (b.quantity || 0), 0);
      chartData.push({
        name: club.name,
        value: totalCount
      });
    });
    this.pieChartOptions = {
      title: {
        text: 'Клубове'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{c} бр. ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        data: this.clubs.map(club => club.name)
      },
      series: [
        {
          name: 'Продажби',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    }
  }

  getPieChartData() {
    if (this.clubs.length != 0) {
      this.refreshPieChartData();
    } else {
      this.clubsDbService.findAllClubs()
        .then(clubs => {
          this.clubs = clubs;
          this.refreshPieChartData();
        })
        .catch(error => console.log("Cannot fetch clubs from DB :: " + error));
    }
  }

}
