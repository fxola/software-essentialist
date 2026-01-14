Feature: Get one assignment

    As a teacher
    I want to get an assignment
    So that I can view the details of the assignment

    Scenario: Successfully fetch an assignment
        Given an assignment exists
        When I request the assignment
        Then I should successfully get the assignment details

    Scenario: Fail to fetch an assignment that does not exist
        When I try to get an assignment that does not exist
        Then I should not get any assignment details