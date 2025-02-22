export class FilterModel {
    name: string;
    email: string;
    role: string;
  
    constructor(name = "", email = "", role = "") {
      this.name = name;
      this.email = email;
      this.role = role;
    }
  
    reset() {
      this.name = "";
      this.email = "";
      this.role = "";
    }
  
    applyFilters(data: any[]) {
      return data.filter((row) =>
        Object.entries(this).every(([key, value]) =>
          value ? row[key]?.toString().toLowerCase().includes(value.toLowerCase()) : true
        )
      );
    }
  }
  