import { Injectable, inject, signal } from '@angular/core';
import { AlertStateService } from './alert-state.service';
import { Alert, EventType, AlertStatus } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataEngineService {
  private readonly stateService = inject(AlertStateService);

  private simulationIntervalId: any = null;
  readonly isSimulationRunning = signal<boolean>(false);

  private readonly mockTitlesAndDescriptions: Array<{
    title: string;
    description: string;
    eventType: EventType;
  }> = [
    {
      title: '7.2 Magnitude Earthquake Detected in Pacific Ring of Fire',
      description: 'A major seismic event occurred 45km off the coast. Tsunami warnings issued for coastal zones.',
      eventType: 'natural_disaster'
    },
    {
      title: 'Global Tech Stock Index Drops 3.4% in Early Trading',
      description: 'Central bank interest rate announcements triggered sell-offs across major tech indices.',
      eventType: 'market_movement'
    },
    {
      title: 'Emergency Climate Summit Announced by UN General Assembly',
      description: 'Delegates from 190 countries will assemble next week to sign revised emissions targets.',
      eventType: 'breaking_news'
    },
    {
      title: 'Category 4 Hurricane Approaching Gulf Coast',
      description: 'Maximum sustained winds near 130 mph. Mandatory evacuation orders in effect for low-lying counties.',
      eventType: 'natural_disaster'
    },
    {
      title: 'Central Bank Announces Unscheduled Rate Decision',
      description: 'Benchmark interest rates adjusted by +50 bps to combat rising core inflation metrics.',
      eventType: 'market_movement'
    },
    {
      title: 'Breakthrough Announced in Solid-State Battery Research',
      description: 'New electrolyte compound doubles energy density while reducing charge time to 10 minutes.',
      eventType: 'breaking_news'
    }
  ];

  constructor() {
    this.seedInitialData();
  }

  /** Seeds realistic data spanning today and prior days */
  seedInitialData(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const initialAlerts: Alert[] = [
      {
        id: 'alert-mock-1',
        title: 'Major Volcanic Eruption Triggers Regional Airspace Closure',
        description: 'Mount Lewotobi erupted generating an ash plume reaching 35,000 feet. Flight paths rerouted.',
        eventType: 'natural_disaster',
        status: 'active',
        createdAt: today,
        channels: ['email', 'slack'],
        dispatchLogs: [
          { channelId: 'email', timestamp: today, status: 'success' },
          { channelId: 'slack', timestamp: today, status: 'success' }
        ]
      },
      {
        id: 'alert-mock-2',
        title: 'Crude Oil Futures Surge 5% Following Supply Bottleneck',
        description: 'Key transit canal maintenance delays tanker traffic causing short-term crude volatility.',
        eventType: 'market_movement',
        status: 'active',
        createdAt: today,
        channels: ['slack'],
        dispatchLogs: [
          { channelId: 'slack', timestamp: today, status: 'success' }
        ]
      },
      {
        id: 'alert-mock-3',
        title: 'Global Energy Infrastructure Cyber Incident',
        description: 'Security operation centers reporting coordinated probes targeting regional power grids.',
        eventType: 'breaking_news',
        status: 'inactive',
        createdAt: today,
        channels: ['email'],
        dispatchLogs: [
          { channelId: 'email', timestamp: today, status: 'failed', errorMessage: 'SMTP Timeout' }
        ]
      },
      {
        id: 'alert-mock-4',
        title: 'Flash Flood Watch Issued for Metropolitan Area',
        description: 'Severe thunderstorm cell predicted to dump 3 inches of rain per hour during peak commute.',
        eventType: 'natural_disaster',
        status: 'active',
        createdAt: yesterday,
        channels: ['email', 'slack'],
        dispatchLogs: [
          { channelId: 'email', timestamp: yesterday, status: 'success' },
          { channelId: 'slack', timestamp: yesterday, status: 'success' }
        ]
      },
      {
        id: 'alert-mock-5',
        title: 'Foreign Exchange Volatility Hit 6-Month High',
        description: 'Unexpected trade balance reports triggered currency fluctuations against USD and EUR.',
        eventType: 'market_movement',
        status: 'inactive',
        createdAt: twoDaysAgo,
        channels: ['slack'],
        dispatchLogs: [
          { channelId: 'slack', timestamp: twoDaysAgo, status: 'success' }
        ]
      }
    ];

    this.stateService.setAlerts(initialAlerts);
  }

  /** Triggers a single randomized alert immediately */
  triggerRandomAlert(): Alert | null {
    if (!this.stateService.globalAlertCreationEnabled()) {
      console.warn('[Mock Engine] Global alert creation is disabled by Admin.');
      return null;
    }

    const template = this.mockTitlesAndDescriptions[
      Math.floor(Math.random() * this.mockTitlesAndDescriptions.length)
    ];

    const availableChannels = this.stateService.activeChannels().map(c => c.id);
    if (availableChannels.length === 0) return null;

    // Pick 1 or more available channels randomly
    const selectedChannels = availableChannels.filter(() => Math.random() > 0.3);
    const channelsToUse = selectedChannels.length > 0 ? selectedChannels : [availableChannels[0]];

    const status: AlertStatus = Math.random() > 0.2 ? 'active' : 'inactive';
    const createSuccess = Math.random() > 0.15; // 85% success rate simulation

    const newAlert: Alert = {
      id: `alert-gen-${Date.now()}`,
      title: template.title,
      description: template.description,
      eventType: template.eventType,
      status,
      createdAt: new Date(),
      channels: channelsToUse,
      dispatchLogs: channelsToUse.map(channelId => ({
        channelId,
        timestamp: new Date(),
        status: createSuccess ? 'success' : 'failed',
        errorMessage: createSuccess ? undefined : 'Simulated network timeout'
      }))
    };

    // Push into central state
    this.stateService.createAlert({
      title: newAlert.title,
      description: newAlert.description,
      eventType: newAlert.eventType,
      status: newAlert.status,
      channels: newAlert.channels
    });

    return newAlert;
  }

  /** Starts automatic background generation of new world events */
  startSimulation(intervalMs: number = 15000): void {
    if (this.simulationIntervalId) return;

    this.isSimulationRunning.set(true);
    this.simulationIntervalId = setInterval(() => {
      this.triggerRandomAlert();
    }, intervalMs);
  }

  /** Stops background event generation */
  stopSimulation(): void {
    if (this.simulationIntervalId) {
      clearInterval(this.simulationIntervalId);
      this.simulationIntervalId = null;
    }
    this.isSimulationRunning.set(false);
  }
}