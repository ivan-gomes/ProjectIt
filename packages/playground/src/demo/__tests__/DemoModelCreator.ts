import {
    PiElementReference,
    DemoEntity,
    DemoAttribute,
    DemoFunction,
    DemoVariable,
    DemoVariableRef,
    DemoIfExpression,
    DemoComparisonExpression,
    DemoNumberLiteralExpression,
    DemoOrExpression,
    DemoStringLiteralExpression,
    DemoAndExpression,
    DemoPlusExpression,
    DemoPlaceholderExpression,
    DemoModel,
    DemoAttributeType,
    DemoExpression,
    DemoBinaryExpression,
    DemoLessThenExpression,
    DemoMultiplyExpression,
    DemoDivideExpression,
    DemoBooleanLiteralExpression,
    DemoGreaterThenExpression,
    DemoEqualsExpression,
    DemoLiteralExpression,
    AppliedFeature
} from "../language/gen";
import { MakeDivideExp, MakeEqualsExp, MakeLessThenExp, makeLiteralExp, MakeMultiplyExp, MakePlusExp } from "./HelperFunctions";
import { DemoUnparser } from "../unparser/DemoUnparser";

export class DemoModelCreator {

    public createModelWithAppliedfeature(): DemoModel {
        let result = this.createCorrectModel();
        let length = result.functions[0];
        let expression: DemoVariableRef = new DemoVariableRef();
        expression.attribute = new PiElementReference<DemoAttribute>(length.parameters[0], "DemoAttribute"); // Variable1 : Person
        let xx: AppliedFeature = new AppliedFeature();
        xx.value = "myfirstAppliedFeature";
        xx.type = new PiElementReference<DemoEntity>(result.entities[1], "DemoEntity"); // Company
        expression.appliedfeature = xx;
        let yy: AppliedFeature = new AppliedFeature();
        yy.value = "mysecondAppliedFeature";
        xx.appliedfeature = yy;
        length.expression = expression;
        return result;
    }

    public createInheritanceModel(): DemoModel {
        let inheritanceModel: DemoModel = DemoModel.create("DemoModel_with_inheritance");
        const vehicleEnt = DemoEntity.create("Vehicle");
        const brand = DemoAttribute.create("brand");
        const vehicleName = DemoAttribute.create("name");
        vehicleEnt.attributes.push(brand);
        vehicleEnt.attributes.push(vehicleName);

        const carEnt = DemoEntity.create("Car");
        const numberplate = DemoAttribute.create("numberplate");
        const carType = DemoAttribute.create("make");
        // carEnt.baseEntity.push(new PiElementReference<DemoEntity>(vehicleEnt, "DemoEntity"));
        carEnt.baseEntity = new PiElementReference<DemoEntity>(vehicleEnt, "DemoEntity");
        carEnt.attributes.push(numberplate);
        carEnt.attributes.push(carType);

        const bikeEnt = DemoEntity.create("Bike");
        const backseat = DemoAttribute.create("backseat");
        const gears = DemoAttribute.create("gears");
        // bikeEnt.baseEntity.push(new PiElementReference<DemoEntity>(vehicleEnt, "DemoEntity"));
        bikeEnt.baseEntity = new PiElementReference<DemoEntity>(vehicleEnt, "DemoEntity");
        bikeEnt.attributes.push(backseat);
        bikeEnt.attributes.push(gears);

        const racebikeEnt = DemoEntity.create("RaceBike");
        const color = DemoAttribute.create("color");
        const wheelsize = DemoAttribute.create("wheelsize");
        // racebikeEnt.baseEntity.push(new PiElementReference<DemoEntity>(bikeEnt, "DemoEntity"));
        racebikeEnt.baseEntity = new PiElementReference<DemoEntity>(bikeEnt, "DemoEntity");
        racebikeEnt.attributes.push(color);
        racebikeEnt.attributes.push(wheelsize);

        inheritanceModel.entities.push(vehicleEnt);
        inheritanceModel.entities.push(carEnt);
        inheritanceModel.entities.push(bikeEnt);
        inheritanceModel.entities.push(racebikeEnt);

        return inheritanceModel;
    }

    public createInheritanceWithLoop(): DemoModel {
        let result = this.createInheritanceModel();
        // let Vehicle inherit from RaceBike
        result.entities[0].baseEntity = new PiElementReference<DemoEntity>(result.entities[3], "DemoEntity");
        return result;
    }

    public createCorrectModel(): DemoModel {
        let correctModel: DemoModel = DemoModel.create("DemoModel_1");

        const length = DemoFunction.create("length");
        const Variable1 = DemoVariable.create("Variable1")
        const VariableNumber2 = DemoVariable.create("VariableNumber2")
        length.parameters.push(Variable1);
        length.parameters.push(VariableNumber2);
        length.expression = this.addComplexExpression1();
        // length(Variable1, VariableNumber2): (IF (2 < 5) THEN 1 ELSE 5 ENDIF + ((1 / 2) * 'Person'))

        const determine = DemoFunction.create("determine");
        const AAP = DemoVariable.create("AAP")
        determine.parameters.push(AAP);
        determine.expression = MakePlusExp("Hello Demo", "Goodbye")
        // determine(AAP) = "Hello Demo" + "Goodbye"

        const last = DemoFunction.create("last");
        last.expression = MakePlusExp("5", "woord");
        // last() = 5 + "woord"

        correctModel.functions.push(length);
        correctModel.functions.push(determine);
        correctModel.functions.push(last);

        const personEnt = DemoEntity.create("Person");
        const age = DemoAttribute.create("age");
        const personName = DemoAttribute.create("name");
        personEnt.attributes.push(age);
        personEnt.attributes.push(personName);
        const first = DemoFunction.create("first");
        const Resultvar = DemoVariable.create("Resultvar");
        first.parameters.push(Resultvar);
        first.expression = MakePlusExp("5", "24");
        personEnt.functions.push(first);
        // Person { age, first(Resultvar) = 5 + 24 }

        const companyEnt = DemoEntity.create("Company");
        const companyName = DemoAttribute.create("name");
        const VAT_Number = DemoAttribute.create("VAT_Number");
        companyEnt.attributes.push(companyName);
        companyEnt.attributes.push(VAT_Number);

        const another = DemoFunction.create("another");
        const NOOT = DemoVariable.create("NOOT");
        another.parameters.push(NOOT);
        another.expression = this.addComplexExpression2(companyName);
        // another(NOOT) = ("Yes" or ("No" = Variable1)) OR ("x" < 122) AND ("Hello World" < "Hello Universe") + (1/2) * ...

        companyEnt.functions.push(another);
        // Company { name, VAT_Number, another(NOOT) = ... }

        correctModel.entities.push(personEnt);
        correctModel.entities.push(companyEnt);

        this.addEntityTypes(companyEnt, personEnt, personName, companyName, age,
            VAT_Number, length, first, last, determine,
            another, Variable1, VariableNumber2, Resultvar, AAP,
            NOOT);
        return correctModel;
    }

    private addSimpleTypes(personName: DemoAttribute, companyName: DemoAttribute, age: DemoAttribute,
                           VAT_Number: DemoAttribute, length: DemoFunction, first: DemoFunction, last: DemoFunction, determine: DemoFunction,
                           another: DemoFunction, Variable1: DemoVariable, VariableNumber2: DemoVariable, Resultvar: DemoVariable, AAP: DemoVariable,
                           NOOT: DemoVariable) {
        // personName.declaredType = DemoAttributeType.String;
        // companyName.declaredType = DemoAttributeType.String;
        // age.declaredType = DemoAttributeType.Integer;
        // VAT_Number.declaredType = DemoAttributeType.Integer;
        // length.declaredType = DemoAttributeType.String;
        // first.declaredType = DemoAttributeType.Boolean;
        // last.declaredType = DemoAttributeType.Boolean;
        // determine.declaredType = DemoAttributeType.Boolean;
        // another.declaredType = DemoAttributeType.Boolean;
        // Variable1.declaredType = DemoAttributeType.Boolean;
        // VariableNumber2.declaredType = DemoAttributeType.Boolean;
        // Resultvar.declaredType = DemoAttributeType.Boolean;
        // AAP.declaredType = DemoAttributeType.Boolean;
        // NOOT.declaredType = DemoAttributeType.Boolean;
    }

    private addEntityTypes(companyEnt: DemoEntity, personEnt: DemoEntity, personName: DemoAttribute, companyName: DemoAttribute, age: DemoAttribute,
                           VAT_Number: DemoAttribute, length: DemoFunction, first: DemoFunction, last: DemoFunction, determine: DemoFunction,
                           another: DemoFunction, Variable1: DemoVariable, VariableNumber2: DemoVariable, Resultvar: DemoVariable, AAP: DemoVariable,
                           NOOT: DemoVariable) {
        personName.declaredType = new PiElementReference<DemoEntity>(companyEnt, "DemoEntity");
        companyName.declaredType = new PiElementReference<DemoEntity>(companyEnt, "DemoEntity");
        age.declaredType = new PiElementReference<DemoEntity>(companyEnt, "DemoEntity");
        VAT_Number.declaredType = new PiElementReference<DemoEntity>(companyEnt, "DemoEntity");
        length.declaredType = new PiElementReference<DemoEntity>(companyEnt, "DemoEntity");
        first.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        last.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        determine.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        another.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        Variable1.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        VariableNumber2.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        Resultvar.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        AAP.declaredType = new PiElementReference<DemoEntity>(personEnt, "DemoEntity");
        NOOT.declaredType = new PiElementReference<DemoEntity>(companyEnt, "DemoEntity");
    }

    private addComplexExpression1(): DemoExpression {
        // (IF (2 < 5) THEN 1 ELSE 5 ENDIF + ((1 / 2) * 'Person'))

        const ifExpression = new DemoIfExpression();
        ifExpression.condition = MakeLessThenExp("2", "5"); //("<")
        ifExpression.whenTrue = makeLiteralExp("1");
        ifExpression.whenFalse = makeLiteralExp("5");
        const divideExpression = MakeDivideExp("1", "2");
        const multiplyExpression = MakeMultiplyExp(divideExpression, "Person");
        const plusExpression = MakePlusExp(ifExpression, multiplyExpression);

        return plusExpression;
    }

    private addComplexExpression2(attr: DemoAttribute): DemoExpression {
        // ("Yes" or ("No" = Variable1)) OR ("x" < 122) AND ("Hello World" < "Hello Universe") + (1/2) * ...

        const varRef = new DemoVariableRef();
        // varRef.referredName = "Variable1";
        varRef.attribute = new PiElementReference<DemoAttribute>(attr, "DemoAttribute");

        const equals: DemoBinaryExpression = MakeEqualsExp("No", varRef); // ("=");
        // equals : "No" = Variable1

        const leftOr = new DemoOrExpression();
        leftOr.right = equals;
        leftOr.left = makeLiteralExp("Yes");
        // leftOr : ("Yes" or ("No" = Variable1))

        const rightAnd: DemoBinaryExpression = MakeLessThenExp("x", "122");
        // rightAnd : ("x" < 122)

        const leftAnd = MakeLessThenExp("Hello World", "Hello Universe");
        // leftAnd : ("Hello World" < "Hello Universe")

        const rightOr = new DemoAndExpression();
        rightOr.right = rightAnd;
        rightOr.left = leftAnd;
        // rightOr : ("x" < 122) AND ("Hello World" < "Hello Universe")

        const thenExpression = new DemoOrExpression();
        thenExpression.left = leftOr;
        thenExpression.right = rightOr;
        // thenExpression : ("Yes" or ("No" = Variable1)) OR ("x" < 122) AND ("Hello World" < "Hello Universe")

        const divideExpression = MakePlusExp("1", "2");
        // divideExpression : (1/2)

        const multiplyExpression = MakeMultiplyExp(divideExpression, new DemoPlaceholderExpression());
        // multiplyExpression : (1/2) * ...

        const plusExpression = MakePlusExp(thenExpression, multiplyExpression);
        // plusexpression : ("Yes" or ("No" = Variable1)) OR ("x" < 122) AND ("Hello World" < "Hello Universe") + (1/2) * ...

        return plusExpression;
    }



}