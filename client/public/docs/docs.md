# Argos

A system for placing devices on a map in preparation for future spatial experiments.

## Motivation

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Configuration
- The tileserver location and attribution can be customized in `client/public/config.json`

## Definitions

Here are some of the actors and entities that participate in the Argos placement system

#### Experiment

The experiment, testing a some phenomenon, will include various tests spread over time and space.  
The experiment is well defined entity and does not depend on other experiments.

#### Trial

Trial is a one time instance for testing something, it usually represents a field excursion on a specific date.

#### Device

Device is a physical or abstract instrument that is part of the experiment.  
When participates in a trial, it has a geographic location.

#### Attribute

Each trial and device can have multiple values describing them, each called attribute.  
The attributes for each device or trial are defined in the device-type or trial-type respectively.  
An attribute can have various forms:
- string
- number
- date
- boolean
- select
- etc...

## Create experiment

#### Declare devices
#### Declare trials
#### Place devices on trial
#### Edit attributes
#### Device groups and containment

## Import export

#### Experiment
- Export as Zip with:
  - data.json
  - shapes.geojson
  - images subfolder with PNGs
- Import Zip

#### Trial
- Export GeoJson 
- Import GeoJson 
- Export Zip of CSVs one for each device type
- Import Zip of CSVs
- Import one CSVs of a device type



