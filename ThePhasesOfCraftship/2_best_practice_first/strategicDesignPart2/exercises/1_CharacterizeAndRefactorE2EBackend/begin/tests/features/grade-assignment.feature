Feature: Grade Assignment

    As a Teacher
    I want to grade an assignment
    So that i can give feedback to the student

    Scenario: Sucessfully grade an assignment
        Given a student submits an assignment
        When I grade the assignment
        Then the assignment should be graded successfully

    Scenario: Fail to grade an assignment when an invalid grade is provided
        Given a student submits an assignment
        When I grade the assignment with an unrecognized grade
        Then the assignment should not be graded

    Scenario: Fail to grade an assignment when it has been previously graded
        Given a student submits an assignment
        When I try to grade the assignment that has been graded
        Then the assignment should not be graded

   
        
