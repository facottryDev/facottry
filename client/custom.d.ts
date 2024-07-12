type TableColumn = any;
type TableRow = any;

type configs = {
  appConfigs: config[];
  playerConfigs: config[];
  customConfigs: config[];
  configTypes: [
    {
      name: string;
      desc: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }
  ]
};

type config = {
  configID: string;
  projectID: string;
  name: string;
  type: string;
  desc: string;
  params: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  email: string;
  name: string;
  address: string;
  mobile: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
};

type Company = {
  companyID: string;
  name: string;
  address: string;
  role: "owner" | "employee";
  joinRequests: string[];
  activeInvites: string[];
  owners: string[];
  employees: string[];
};

type Project = {
  projectID: string;
  name: string;
  type: "PROD" | "DEV" | "UAT" | "TEST";
  role: "owner" | "editor" | "viewer";
  joinRequests: string[];
  activeInvites: string[];
  owners: string[];
  editors: string[];
  viewers: string[];
  filters: Filter;
  configTypes: [{
    name: string;
    desc: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }]
};

type Filter = any;