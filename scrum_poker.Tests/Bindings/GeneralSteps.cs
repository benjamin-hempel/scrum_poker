using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using TechTalk.SpecFlow;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace scrum_poker.Tests.Bindings
{
    [Binding]
    class GeneralSteps
    {
        [When(@"I wait ""(.*)"" seconds")]
        public void WhenIWaitSeconds(int secondsToWait)
        {
            Thread.Sleep(secondsToWait * 1000);
        }

    }
}
