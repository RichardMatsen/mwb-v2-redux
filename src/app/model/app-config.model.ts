
export interface IAppConfig {
  baseDataUrl: string;
  clinicsConfig: {
    filePrefixes: string[];
    numDataPointsForSparkline: number;
    numInitialFilesToDisplay: number;
    page: {
      pageTitle: string;
      pageDescription: string;
      listTitle: string;
      listWidth: number;
      badgeUnits: string;
      resultsZoom: string;
    }
  };
  validationsConfig: {
    filePrefixes: string[];
    numDataPointsForSparkline: number;
    numInitialFilesToDisplay: number;
    page: {
      pageTitle: string;
      pageDescription: string;
      listTitle: string;
      listWidth: number;
      badgeUnits: string;
      resultsZoom: string;
    }
  };
  referentialsConfig: {
    filePrefixes: string[];
    daysToInitialize: number;
    daysToDisplay: number;
    page: {
      pageTitle: string;
      pageDescription: string;
      listTitle: string;
      listWidth: number;
      badgeUnits: string;
      resultsZoom: string;
    }
  }
}
