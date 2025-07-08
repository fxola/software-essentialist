Feature: Submit Assignment

    As a Student
    I want to submit an assignment
    So that it can be graded

    Scenario: Sucessfully submit an assignment
        Given I am an enrolled student I have been assigned an assignment
        When I want to submit an assignment
        Then the assignment should be submitted successfully

    Scenario: Fail to submit an assignment when it does not exist
        Given I am an enrolled student 
        When I want to submit an assignment that does not exist
        Then the assignment should not be submitted

    Scenario: Fail to submit an assignment when it has been previously submitted
        Given I am an enrolled student 
        When I want to submit an assignment that has been submitted
        Then the assignment should not be submitted

   
        
