Feature: Get one student

    As an administrator
    I want to get a student
    So that I can view the student's details

    Scenario: Successfully fetch one student
        Given a student exists
        When I request the student
        Then I should successfully get the student details

    Scenario: Fail to fetch a student that does not exist
        When I try to get a student that does not exist
        Then I should not get any student details