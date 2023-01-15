import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let calculator: CalculatorService, loggerSpy: any;

  beforeEach(() => {
    console.log("calling beforeEch");

    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    calculator = TestBed.get(CalculatorService);
  });

  it("should add two numbers", () => {
    console.log("calling add");

    const result = calculator.add(5, 3);

    expect(result).toBe(8);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers", () => {
    console.log("calling subtract");

    const result = calculator.subtract(5, 3);

    expect(result).toBe(2);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
