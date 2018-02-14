# HW1 - Part2 Provisioning Servers

### Screencast
https://youtu.be/r-PS8otpGEM

### Concepts

#### 1. Define idempotency. Give two examples of an idempotent operation and non-idempotent operation.
Idempotency means that applying the same operation, multiple times results in the same state. In software it means that making multiple calls to a code snippet gives the same result. 
Example for idempotent operations:
i. Retrieving values from the database multiple times. 
ii. While automating the installation of any product, if your code snippet checks the state of the machine before performing any task, the operation will be idempotent. Before installation, if we perform a check and skip the task if a configuration file is present; the task will be idempotent.

Examples of non-idempotent operations:
i. Remove a directory. The directory is deleted in first run and this operation throws an error from the second run.
ii. Inserting same values into the database multiple times. Generally, the web forms issue POST request to store data and this operation is not idempotent.

#### 2. Describe several issues related to management of your inventory.
I faced the following isses while managing inventory file:
- While provisioning AWS/DigitalOcean instances, I would rapidly create and delete them. But it would become an added responsibility to delete them from my inventory file. If not deleted, ansible will try connecting to the host and give host not found exception.
- In a large company with thousands of servers, managing the inventory file is very difficult. Properly tagging the running servers and the different states of those servers can be difficult. Like if 100 servers have old version of the product and 10 servers are upgraded. Then the inventory file should also reflect the change in state.

#### 3. Describe two configuration models. What are disadvantages and advantages of each model?
The two types of configuration models are - 
i. Push Model - In this model, changes are pushed from configuration server to client/asset.
Advantage: 
-Easier to manage as all assets are managed centrally.
Disadvantage: 
- Less enforcement of state: If any file/configuration is edited locally in one of the clients/assets, configurations will not remain same across all clients/assets and the client/asset can drift from configuration(server).

ii. Pull Model - In this any change in client/asset is pulled by the configuration server.
Advantage:
- This model is better at ensuring that assets stay in sync with configuration.
- Asset can register itself.
Disadvantage:
- This is more complex.

#### 4. What are some of the consquences of not having proper configuration management?
If we do not have proper configuration management, we will face the following consequences:
- Difficulty in identifying/patching bugs in older versions of the application.
- The changes in production environment cannot be tracked and the bug cannot be replicated by the developer.
- Software dependencies if not enforced will create a havoc while testing and managing applications.
