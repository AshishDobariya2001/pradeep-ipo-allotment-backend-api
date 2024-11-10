import { Injectable, Logger } from '@nestjs/common';
import { Cluster } from 'puppeteer-cluster';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  private cluster: Cluster<any, any>;

  async initCluster() {
    if (!this.cluster) {
      this.cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
        puppeteerOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      });
    }
  }

  async closeCluster() {
    await this.cluster.close();
  }

  async executeTask(taskFn: (page: puppeteer.Page) => Promise<any>) {
    await this.initCluster();
    return this.cluster.execute(taskFn);
  }
}
