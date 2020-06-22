class person {
    constructor(name = "noname", age = "20") {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        const obj = {
            name: this.name,
            age: this.age,
        };
        return JSON.stringify(obj);
    };
};

module.exports = person;
// const p1 = new person("Jack","50");
// const p2 = new person("Judy","30");
// console.log(p1.toJSON());
// console.log(p2.toJSON());